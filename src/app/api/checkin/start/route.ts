import { NextRequest, NextResponse } from "next/server";
import { getCurrentUserSummary } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";
import { resolveVenueSlug } from "@/lib/checkin";

export async function POST(request: NextRequest) {
  const user = await getCurrentUserSummary();

  if (!user) {
    return NextResponse.json(
      { success: false, message: "Please log in first." },
      { status: 401 }
    );
  }

  try {
    const { bookingId, venueSlug } = await request.json();

    if (!bookingId) {
      return NextResponse.json(
        { success: false, message: "Booking ID required." },
        { status: 400 }
      );
    }

    // Verify booking belongs to this user and is confirmed
    const booking = await prisma.booking.findFirst({
      where: {
        id: bookingId,
        userId: user.id,
        status: "confirmed",
      },
    });

    if (!booking) {
      return NextResponse.json(
        { success: false, message: "Booking not found or not yours." },
        { status: 404 }
      );
    }

    // Check for existing active check-in
    const existingActive = await prisma.bookingCheckin.findFirst({
      where: {
        userId: user.id,
        space: booking.space,
        status: "checked_in",
      },
    });

    if (existingActive) {
      return NextResponse.json(
        {
          success: false,
          message: "You already have an active session.",
        },
        { status: 409 }
      );
    }

    // Resolve venue QR code ID if available
    const venue = resolveVenueSlug(venueSlug || "arcade-main-gate");
    let qrCodeId: string | null = null;
    if (venue) {
      const venueQR = await prisma.venueQRCode.findFirst({
        where: { venue: venue.space, isActive: true },
      });
      qrCodeId = venueQR?.id ?? null;
    }

    // Create check-in record
    const now = new Date();
    const checkin = await prisma.bookingCheckin.create({
      data: {
        bookingId: booking.id,
        userId: user.id,
        space: booking.space,
        qrCodeId,
        checkedInAt: now,
        status: "checked_in",
        checkinMethod: "qr_scan",
      },
    });

    return NextResponse.json({
      success: true,
      checkinId: checkin.id,
      checkedInAt: now.toISOString(),
      message: "Check-in successful!",
    });
  } catch (err) {
    console.error("Check-in start error:", err);
    return NextResponse.json(
      { success: false, message: "Failed to check in. Please try again." },
      { status: 500 }
    );
  }
}