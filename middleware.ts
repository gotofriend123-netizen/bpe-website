import { NextResponse, type NextRequest } from "next/server";

import { applyPendingCookies, refreshSupabaseAuth } from "@/lib/supabase/middleware";

const protectedPrefixes = ["/dashboard", "/admin"];

export async function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const isProtected = protectedPrefixes.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );

  // Always refresh the Supabase session on every route so
  // tokens stay alive while the user browses any page.
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
