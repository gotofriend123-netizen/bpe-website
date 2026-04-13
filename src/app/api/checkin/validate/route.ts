import { NextResponse } from "next/server";
import { getCurrentUserSummary } from "@/lib/auth/session";
import { validateCheckinForUser } from "@/lib/checkin";

export async function GET() {
  const user = await getCurrentUserSummary();
  
  if (!user) {
    return NextResponse.json(
      { valid: false, error: "NOT_LOGGED_IN", message: "Please log in to continue check-in." },
      { status: 401 }
    );
  }

  const result = await validateCheckinForUser(user.id);
  
  return NextResponse.json(result);
}