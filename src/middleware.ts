import { NextResponse, type NextRequest } from "next/server";

import { applyPendingCookies, refreshSupabaseAuth } from "@/lib/supabase/middleware";

const protectedPrefixes = ["/dashboard", "/admin", "/check-in"];
const authPrefixes = ["/login", "/signup"];

export async function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const isProtected = protectedPrefixes.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
  const isAuthPage = authPrefixes.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );

  let user = null;
  let response = NextResponse.next({ request: { headers: request.headers } });
  let pendingCookies: { name: string; value: string; options: import("@supabase/ssr").CookieOptions }[] = [];

  try {
    // Always refresh the Supabase session on every route so
    // tokens stay alive while the user browses any page.
    const authResult = await refreshSupabaseAuth(request);
    response = authResult.response;
    pendingCookies = authResult.pendingCookies;
    user = authResult.user;

    // Ensure cookies are always applied to response
    if (pendingCookies.length > 0) {
      applyPendingCookies(response, pendingCookies);
    }
  } catch {
    // If Supabase auth fails for any reason, treat user as unauthenticated.
    // Protected routes will redirect to login below.
    user = null;
  }

  if (isAuthPage && user) {
    const dashboardUrl = request.nextUrl.clone();
    dashboardUrl.pathname = "/dashboard";
    dashboardUrl.search = "";
    const redirectResponse = NextResponse.redirect(dashboardUrl);
    applyPendingCookies(redirectResponse, pendingCookies);
    return redirectResponse;
  }

  if (!isProtected) {
    // Ensure cookies are applied for non-protected routes too
    if (pendingCookies.length > 0) {
      applyPendingCookies(response, pendingCookies);
    }
    return response;
  }

  if (user) {
    // Apply cookies to authenticated response
    const authResponse = NextResponse.next({
      request: {
        headers: request.headers,
      },
    });
    applyPendingCookies(authResponse, pendingCookies);
    return authResponse;
  }

  const loginUrl = request.nextUrl.clone();
  loginUrl.pathname = "/login";
  loginUrl.searchParams.set("next", `${pathname}${search}`);
  const redirectResponse = NextResponse.redirect(loginUrl);
  applyPendingCookies(redirectResponse, pendingCookies);
  return redirectResponse;
}

export const config = {
  matcher: [
    /*
     * Match all routes except:
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico
     * - public assets
     * - api routes (handled by their own auth)
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};
