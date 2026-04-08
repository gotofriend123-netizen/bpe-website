import { type NextRequest, NextResponse } from "next/server";
import { createServerClient, type CookieOptions } from "@supabase/ssr";
import type { User as SupabaseAuthUser } from "@supabase/supabase-js";

import { getSupabaseEnv, hasSupabaseEnv } from "./env";

type PendingCookie = {
  name: string;
  value: string;
  options: CookieOptions;
};

export function applyPendingCookies<T extends NextResponse>(
  response: T,
  pendingCookies: PendingCookie[],
) {
  pendingCookies.forEach(({ name, value, options }) => {
    response.cookies.set(name, value, options);
  });

  return response;
}

export async function refreshSupabaseAuth(request: NextRequest) {
  const pendingCookies: PendingCookie[] = [];
  const response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  if (!hasSupabaseEnv()) {
    return { response, pendingCookies, user: null as SupabaseAuthUser | null };
  }

  const { url, anonKey } = getSupabaseEnv();
  const supabase = createServerClient(url, anonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach((cookie) => {
          pendingCookies.push(cookie);
        });
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  applyPendingCookies(response, pendingCookies);

  return {
    response,
    pendingCookies,
    user,
  };
}
