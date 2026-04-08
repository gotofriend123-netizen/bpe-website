import { NextResponse } from "next/server";

import {
  normalizeRedirectPath,
  syncUserProfileFromAuthIdentity,
} from "@/lib/auth/session";
import { getFriendlyAuthFailureMessage } from "@/lib/auth/messages";
import { loginSchema } from "@/lib/auth/validation";
import { createRouteSupabaseClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => null);
    const parsed = loginSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Invalid credentials." },
        { status: 400 },
      );
    }

    const { email, password, nextPath } = parsed.data;
    const { supabase, applyToResponse } = createRouteSupabaseClient();
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.toLowerCase(),
      password,
    });

    if (error || !data.user) {
      return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
    }

    const user = await syncUserProfileFromAuthIdentity(data.user);

    if (!user) {
      return NextResponse.json(
        { error: "Unable to load your profile right now." },
        { status: 500 },
      );
    }

    const response = NextResponse.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      redirectTo: normalizeRedirectPath(
        nextPath,
        user.role === "admin" ? "/admin" : "/dashboard",
      ),
    });

    return applyToResponse(response);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unable to sign you in right now.";

    return NextResponse.json(
      { error: getFriendlyAuthFailureMessage(message) },
      { status: 500 },
    );
  }
}
