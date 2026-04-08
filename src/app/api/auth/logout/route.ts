import { NextResponse } from "next/server";

import { createRouteSupabaseClient } from "@/lib/supabase/server";

async function handleLogout() {
  const { supabase, applyToResponse } = createRouteSupabaseClient();
  await supabase.auth.signOut();

  const response = NextResponse.json({ ok: true });
  return applyToResponse(response);
}

export async function POST() {
  return handleLogout();
}

export async function DELETE() {
  return handleLogout();
}
