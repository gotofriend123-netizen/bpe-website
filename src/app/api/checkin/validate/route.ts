import { NextRequest, NextResponse } from "next/server";
import { getCurrentUserSummary } from "@/lib/auth/session";
import { validateCheckinForUser, resolveVenueSlug } from "@/lib/checkin";

export async function GET(request: NextRequest) {
  const user = await getCurrentUserSummary();

  if (!user) {
    return NextResponse.json(
      {
        valid: false,
        error: "NOT_LOGGED_IN",
        message: "Please log in to continue check-in.",
      },
      { status: 401 }
    );
  }

  const venueSlug = request.nextUrl.searchParams.get("venue") || "arcade-main-gate";

  const venue = resolveVenueSlug(venueSlug);
  if (!venue) {
    return NextResponse.json(
      { valid: false, error: "INVALID_VENUE", message: "Invalid venue." },
      { status: 400 }
    );
  }

  const result = await validateCheckinForUser(user.id, venue.space);

  return NextResponse.json(result);
}