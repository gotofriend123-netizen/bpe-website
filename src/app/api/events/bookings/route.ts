import { NextResponse } from "next/server";

import { createEventBooking, eventBookingSchema } from "@/lib/events/service";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = eventBookingSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          message: "Please complete the event booking form correctly.",
          errors: parsed.error.issues,
        },
        { status: 400 },
      );
    }

    const result = await createEventBooking(parsed.data);

    return NextResponse.json(
      {
        message: "Event booking confirmed successfully.",
        reference: result.booking.reference,
        confirmationUrl: result.confirmationUrl,
        notifications: result.notifications,
      },
      { status: 201 },
    );
  } catch (error) {
    return NextResponse.json(
      {
        message: error instanceof Error ? error.message : "Unable to create event booking.",
      },
      { status: 400 },
    );
  }
}
