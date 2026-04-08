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

    // If Supabase didn't return a session (e.g. email confirmation is on),
    // force-login the user immediately so they skip email verification.
    if (!data.session) {
      const { error: loginError } = await supabase.auth.signInWithPassword({
        email: normalizedEmail,
        password,
      });

      if (loginError) {
        // Account was created but auto-login failed; send to login page
        const response = NextResponse.json(
          {
            user: { id: user.id, name: user.name, email: user.email, role: user.role },
            redirectTo: "/login?registered=1",
          },
          { status: 201 },
        );
        return applyToResponse(response);
      }
    }

    const redirectTo = normalizeRedirectPath(
      nextPath,
      user.role === "admin" ? "/admin" : "/dashboard",
    );

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
