import { NextResponse } from "next/server";
import { getCurrentSession } from "@/lib/auth/session";
import { z } from "zod";
import { getBookingDetailsByReference, rescheduleBooking } from "@/lib/booking/service";

type Context = {
  params: { reference: string };
};

const schema = z.object({
  slotId: z.string().min(1),
});

export async function POST(request: Request, context: Context) {
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

    const body = await request.json();
    const parsed = schema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { message: "Please choose a valid new slot." },
        { status: 400 },
      );
    }

    const result = await rescheduleBooking(reference, parsed.data.slotId);
    return NextResponse.json(
      {
        message: "Booking rescheduled successfully.",
        ...result,
      },
      { status: 200 },
    );
  } catch (error) {
    if (error && typeof error === "object" && "status" in error) {
      const serviceError = error as { message?: string; status?: number; code?: string; details?: unknown };
      return NextResponse.json(
        {
          message: serviceError.message || "Unable to reschedule booking.",
          code: serviceError.code,
          details: serviceError.details,
        },
        { status: serviceError.status || 500 },
      );
    }

    const message = error instanceof Error ? error.message : "Unable to reschedule booking.";
    return NextResponse.json({ message }, { status: 500 });
  }
}
