import { NextResponse } from "next/server";
import { getCurrentSession } from "@/lib/auth/session";
import { getBookingDetailsByReference } from "@/lib/booking/service";

type Context = {
  params: { reference: string };
};

export async function GET(_request: Request, context: Context) {
  try {
    const { reference } = context.params;
    const bookingDetails = await getBookingDetailsByReference(reference);

    if (!bookingDetails) {
      return NextResponse.json({ message: "Booking not found." }, { status: 404 });
    }

    const session = await getCurrentSession();
    const currentUser = session?.user ?? null;
    const booking = bookingDetails.booking;
    const canAccess =
      !booking.userId ||
      currentUser?.role === "admin" ||
      currentUser?.id === booking.userId;

    if (!canAccess) {
      return NextResponse.json(
        { message: "This booking is not available from this account." },
        { status: 403 },
      );
    }

    return NextResponse.json(bookingDetails, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to load booking.";
    return NextResponse.json({ message }, { status: 500 });
  }
}
