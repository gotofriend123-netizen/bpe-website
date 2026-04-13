import { NextRequest, NextResponse } from "next/server";
import { getCurrentUserSummary } from "@/lib/auth/session";

export async function POST(request: NextRequest) {
  const user = await getCurrentUserSummary();
  
  if (!user) {
    return NextResponse.json(
      { success: false, message: "Please log in first." },
      { status: 401 }
    );
  }

  try {
    const { bookingId } = await request.json();
    
    if (!bookingId) {
      return NextResponse.json(
        { success: false, message: "Booking ID required." },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Check-in started (demo mode)"
    });
  } catch {
    return NextResponse.json(
      { success: false, message: "Failed to check in" },
      { status: 500 }
    );
  }
}