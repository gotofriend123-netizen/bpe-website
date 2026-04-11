import { NextResponse } from "next/server";
import { getCurrentSession } from "@/lib/auth/session";
import { cancelBooking } from "@/lib/booking/service";
import { getBookingDetailsByReference } from "@/lib/booking/service";
import { getPublicApiError } from "@/lib/server-errors";

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
    const response = getPublicApiError(error, "Unable to cancel booking.");
    return NextResponse.json(
      {
        message: response.message,
        code: response.code,
        details: response.details,
      },
      { status: response.status },
    );
  }
}
