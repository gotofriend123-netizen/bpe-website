import "server-only";

import { redirect } from "next/navigation";
import { Prisma, UserRole } from "@prisma/client";
import type { Session as SupabaseSession, User as SupabaseAuthUser } from "@supabase/supabase-js";

import { prisma } from "@/lib/prisma";
import { hasSupabaseEnv } from "@/lib/supabase/env";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import {
  DEFAULT_ADMIN_REDIRECT,
  DEFAULT_AUTH_REDIRECT,
  isConfiguredAdminEmail,
} from "./constants";

export type AuthRole = UserRole;

export type AuthUser = {
  id: string;
  authUserId?: string | null;
  name: string;
  email: string;
  role: AuthRole;
  createdAt: Date;
};

export type AuthSession = {
  id: string;
  expiresAt: Date;
  createdAt: Date;
  lastSeenAt: Date;
  user: AuthUser;
};

export type SessionMeta = {
  ipAddress?: string | null;
  userAgent?: string | null;
};

export type RequireAuthOptions = {
  redirectTo?: string;
  fallbackRedirectTo?: string;
};

const userSelect = Prisma.validator<Prisma.UserSelect>()({
  id: true,
  authUserId: true,
  name: true,
  email: true,
  role: true,
  createdAt: true,
});

export function normalizeRedirectPath(nextPath?: string | null, fallback = DEFAULT_AUTH_REDIRECT) {
  if (!nextPath) {
    return fallback;
  }

  const trimmed = nextPath.trim();
  if (!trimmed.startsWith("/")) {
    return fallback;
  }

  try {
    const parsed = new URL(trimmed, "http://localhost");
    if (parsed.origin !== "http://localhost") {
      return fallback;
    }

    const normalized = `${parsed.pathname}${parsed.search}${parsed.hash}`;
    return normalized.startsWith("/") ? normalized : fallback;
  } catch {
    return fallback;
  }
}

function deriveName(authUser: SupabaseAuthUser) {
  const metadataName =
    typeof authUser.user_metadata?.name === "string" ? authUser.user_metadata.name.trim() : "";

  if (metadataName) {
    return metadataName;
  }

  const emailPrefix = authUser.email?.split("@")[0] ?? "Black Pepper Guest";
  const words = emailPrefix
    .split(/[._-]/)
    .map((part) => part.trim())
    .filter(Boolean)
    .map((part) => part.slice(0, 1).toUpperCase() + part.slice(1));

  return words.join(" ") || "Black Pepper Guest";
}

export async function syncUserProfileFromAuthIdentity(authUser: SupabaseAuthUser) {
  const normalizedEmail = authUser.email?.trim().toLowerCase();

  if (!normalizedEmail) {
    return null;
  }

  const targetRole: AuthRole = isConfiguredAdminEmail(normalizedEmail) ? "admin" : "user";
  const profileData = {
    authUserId: authUser.id,
    email: normalizedEmail,
    name: deriveName(authUser),
  };

  const existingUser = await prisma.user.findFirst({
    where: {
      OR: [{ authUserId: authUser.id }, { email: normalizedEmail }],
    },
    select: userSelect,
  });

  if (!existingUser) {
    return prisma.user.create({
      data: {
        ...profileData,
        role: targetRole,
      },
      select: userSelect,
    });
  }

  const nextRole = targetRole === "admin" ? "admin" : existingUser.role;
  const shouldUpdate =
    existingUser.authUserId !== authUser.id ||
    existingUser.email !== profileData.email ||
    existingUser.name !== profileData.name ||
    existingUser.role !== nextRole;

  if (!shouldUpdate) {
    return existingUser;
  }

  return prisma.user.update({
    where: { id: existingUser.id },
    data: {
      ...profileData,
      role: nextRole,
    },
    select: userSelect,
  });
}

async function getCurrentSupabaseContext(): Promise<{
  authUser: SupabaseAuthUser | null;
  supabaseSession: SupabaseSession | null;
}> {
  if (!hasSupabaseEnv()) {
    return {
      authUser: null,
      supabaseSession: null,
    };
  }

  const supabase = createServerSupabaseClient();
  const [{ data: userData }, { data: sessionData }] = await Promise.all([
    supabase.auth.getUser(),
    supabase.auth.getSession(),
  ]);

  return {
    authUser: userData.user,
    supabaseSession: sessionData.session,
  };
}

export async function getCurrentSession(): Promise<AuthSession | null> {
  const { authUser, supabaseSession } = await getCurrentSupabaseContext();

  if (!authUser) {
    return null;
  }

  const user = await syncUserProfileFromAuthIdentity(authUser);

  if (!user) {
    return null;
  }

  return {
    id: supabaseSession?.access_token ?? authUser.id,
    expiresAt: supabaseSession?.expires_at
      ? new Date(supabaseSession.expires_at * 1000)
      : new Date(Date.now() + 60 * 60 * 1000),
    createdAt: user.createdAt,
    lastSeenAt: new Date(),
    user,
  };
}

export async function getCurrentUser(): Promise<AuthUser | null> {
  const session = await getCurrentSession();
  return session?.user ?? null;
}

export type CurrentUserSummary = AuthUser;

export async function getCurrentUserSummary(): Promise<CurrentUserSummary | null> {
  return getCurrentUser();
}

export async function requireUser(options: RequireAuthOptions = {}): Promise<AuthSession> {
  const session = await getCurrentSession();

  if (!session) {
    redirect(options.redirectTo ?? "/login");
  }

  return session;
}

export async function requireAdmin(options: RequireAuthOptions = {}): Promise<AuthSession> {
  const session = await getCurrentSession();

  if (!session) {
    redirect(options.redirectTo ?? "/login");
  }

  if (session.user.role !== "admin") {
    redirect(options.fallbackRedirectTo ?? DEFAULT_ADMIN_REDIRECT);
  }

  return session;
}
