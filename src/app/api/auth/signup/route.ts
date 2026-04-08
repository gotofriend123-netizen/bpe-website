import { NextResponse } from "next/server";

import {
  normalizeRedirectPath,
  syncUserProfileFromAuthIdentity,
} from "@/lib/auth/session";
import { getFriendlyAuthFailureMessage, getFriendlySignupErrorMessage } from "@/lib/auth/messages";
import { signupSchema } from "@/lib/auth/validation";
import { createRouteSupabaseClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => null);
    const parsed = signupSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Invalid signup details." },
        { status: 400 },
      );
    }

    const { name, email, password, nextPath } = parsed.data;
    const normalizedEmail = email.toLowerCase();
    const { supabase, applyToResponse } = createRouteSupabaseClient();

    const { data, error } = await supabase.auth.signUp({
      email: normalizedEmail,
      password,
      options: {
        data: {
          name,
        },
      },
    });

    if (error) {
      return NextResponse.json(
        { error: getFriendlySignupErrorMessage(error.message || "Unable to create your account right now.") },
        { status: error.status ?? 400 },
      );
    }

    if (!data.user) {
      return NextResponse.json(
        { error: "Unable to create your account right now." },
        { status: 500 },
      );
    }

    const user = await syncUserProfileFromAuthIdentity(data.user);

    if (!user) {
      return NextResponse.json(
        { error: "Unable to provision your account profile right now." },
        { status: 500 },
      );
    }

    const hasActiveSession = Boolean(data.session);
    const redirectTo = hasActiveSession
      ? normalizeRedirectPath(nextPath, user.role === "admin" ? "/admin" : "/dashboard")
      : nextPath
        ? `/login?registered=1&next=${encodeURIComponent(normalizeRedirectPath(nextPath, "/dashboard"))}`
        : "/login?registered=1";

    const response = NextResponse.json(
      {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
        redirectTo,
      },
      { status: 201 },
    );

    return applyToResponse(response);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unable to create your account right now.";

    return NextResponse.json(
      { error: getFriendlyAuthFailureMessage(message) },
      { status: 500 },
    );
  }
}
