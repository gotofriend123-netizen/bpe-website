import { NextRequest, NextResponse } from "next/server";
import { getCurrentUserSummary } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  const user = await getCurrentUserSummary();

  if (!user) {
    return NextResponse.json(
      { success: false, message: "Please log in first." },
      { status: 401 }
    );
  }

  try {
    const { checkinId } = await request.json();

    if (!checkinId) {
      return NextResponse.json(
        { success: false, message: "Check-in ID required." },
        { status: 400 }
      );
    }

    // Verify the check-in record belongs to this user and is active
    const checkin = await prisma.bookingCheckin.findFirst({
      where: {
        id: checkinId,
        userId: user.id,
        status: "checked_in",
      },
    });

    if (!checkin) {
      return NextResponse.json(
        { success: false, message: "No active check-in found." },
        { status: 404 }
      );
    }

    const now = new Date();
    const checkedInAt = checkin.checkedInAt ?? now;
    const durationMs = now.getTime() - checkedInAt.getTime();
    const actualDurationMinutes = Math.round(durationMs / (1000 * 60));

    // Update the check-in record
    await prisma.bookingCheckin.update({
      where: { id: checkinId },
      data: {
        checkedOutAt: now,
        status: "checked_out",
        actualDurationMinutes,
      },
    });

    return NextResponse.json({
      success: true,
      checkedOutAt: now.toISOString(),
      actualDurationMinutes,
      message: "Check-out completed!",
    });
  } catch (err) {
    console.error("Check-out error:", err);
    return NextResponse.json(
      { success: false, message: "Failed to check out. Please try again." },
      { status: 500 }
    );
  }
}