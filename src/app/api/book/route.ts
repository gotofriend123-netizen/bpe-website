import { NextResponse } from "next/server";
import { isBookingTypeId } from "@/lib/booking-utils";
import { getCurrentSession } from "@/lib/auth/session";
import { bookingRequestSchema } from "@/lib/validations";
import { createBookingFromRequest } from "@/lib/booking/service";
import { getPublicApiError } from "@/lib/server-errors";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = bookingRequestSchema.safeParse(body);

    if (!parsed.success) {
      const flattened = parsed.error.flatten();
      const fieldErrors = Object.fromEntries(
        Object.entries(flattened.fieldErrors).flatMap(([field, messages]) => {
          const firstMessage = messages?.[0];
          return firstMessage ? [[field, firstMessage]] : [];
        }),
      );

      return NextResponse.json(
        {
          message:
            parsed.error.issues[0]?.message ??
            "Please review the booking details and try again.",
          fieldErrors,
        },
        { status: 400 },
      );
    }

    if (!isBookingTypeId(parsed.data.bookingType)) {
      return NextResponse.json(
        {
          message: "Please choose a valid booking type.",
        },
        { status: 400 },
      );
    }

    const result = await createBookingFromRequest({
      customerName: parsed.data.fullName,
      customerEmail: parsed.data.email,
      customerPhone: parsed.data.phoneNumber,
      acceptedPolicies: parsed.data.termsAccepted,
      bookingType: parsed.data.bookingType,
      date: parsed.data.date,
      time: parsed.data.time,
      specificStudio: parsed.data.specificStudio,
      selectedPackage: parsed.data.selectedPackage,
      slotId: parsed.data.slotId,
      userId: (await getCurrentSession())?.user.id ?? null,
    });

    return NextResponse.json(
      {
        message: result.booking.status === "confirmed"
          ? "Booking confirmed successfully."
          : "Booking request received successfully.",
        ...result,
      },
      { status: result.booking.status === "confirmed" ? 201 : 202 },
    );
  } catch (error) {
    const response = getPublicApiError(error, "Unable to create booking.");
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
