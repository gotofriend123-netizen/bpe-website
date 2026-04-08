import { NextResponse } from "next/server";
import { getCurrentSession } from "@/lib/auth/session";
import { cancelBooking } from "@/lib/booking/service";
import { getBookingDetailsByReference } from "@/lib/booking/service";

type Context = {
  params: { reference: string };
};

export async function POST(_request: Request, context: Context) {
  try {
    const { reference } = context.params;
    const session = await getCurrentSession();
    const bookingDetails = await getBookingDetailsByReference(reference);

    if (!bookingDetails) {
      return NextResponse.json({ message: "Booking not found." }, { status: 404 });
    }

    const currentUser = session?.user ?? null;
    const canManage =
      currentUser?.role === "admin" ||
      !bookingDetails.booking.userId ||
      currentUser?.id === bookingDetails.booking.userId;

    if (!canManage) {
      return NextResponse.json(
        { message: "This booking is not available from this account." },
        { status: 403 },
      );
    }

    const result = await cancelBooking(reference);
    return NextResponse.json(
      {
        message: "Booking cancelled successfully.",
        ...result,
      },
      { status: 200 },
    );
  } catch (error) {
    if (error && typeof error === "object" && "status" in error) {
      const serviceError = error as { message?: string; status?: number; code?: string; details?: unknown };
      return NextResponse.json(
        {
          message: serviceError.message || "Unable to cancel booking.",
          code: serviceError.code,
          details: serviceError.details,
        },
        { status: serviceError.status || 500 },
      );
    }

    const message = error instanceof Error ? error.message : "Unable to cancel booking.";
    return NextResponse.json({ message }, { status: 500 });
  }
}
