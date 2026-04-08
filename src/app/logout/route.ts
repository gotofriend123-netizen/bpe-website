import { NextResponse } from "next/server";

import { createRouteSupabaseClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const { supabase, applyToResponse } = createRouteSupabaseClient();
  await supabase.auth.signOut();

  const response = NextResponse.redirect(new URL("/login", request.url));
  return applyToResponse(response);
}
