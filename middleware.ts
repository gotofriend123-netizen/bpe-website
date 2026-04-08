import { NextResponse, type NextRequest } from "next/server";

import { applyPendingCookies, refreshSupabaseAuth } from "@/lib/supabase/middleware";

const protectedPrefixes = ["/dashboard", "/admin"];

export async function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const isProtected = protectedPrefixes.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );

  const { response, pendingCookies, user } = await refreshSupabaseAuth(request);

  if (!isProtected) {
    return response;
  }

  if (user) {
    return response;
  }

  const loginUrl = request.nextUrl.clone();
  loginUrl.pathname = "/login";
  loginUrl.searchParams.set("next", `${pathname}${search}`);

  return applyPendingCookies(NextResponse.redirect(loginUrl), pendingCookies);
}

export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*"],
};
