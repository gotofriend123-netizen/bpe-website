import { NextResponse } from "next/server";
import { z } from "zod";
import { isSpace } from "@/lib/booking-utils";
import { createWaitlistEntry } from "@/lib/booking/service";
import { getPublicApiError } from "@/lib/server-errors";

const waitlistSchema = z.object({
  space: z.string(),
  date: z.string().min(1),
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(6),
  note: z.string().optional(),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = waitlistSchema.safeParse(body);

    if (!parsed.success || !isSpace(parsed.data.space)) {
      return NextResponse.json(
        { message: "Please provide valid waitlist details." },
        { status: 400 },
      );
    }

    const entry = await createWaitlistEntry({
      space: parsed.data.space,
      date: parsed.data.date,
      name: parsed.data.name,
      email: parsed.data.email,
      phone: parsed.data.phone,
      note: parsed.data.note,
    });

    return NextResponse.json(
      {
        message: "You have been added to the waitlist.",
        waitlist: entry,
      },
      { status: 201 },
    );
  } catch (error) {
    const response = getPublicApiError(error, "Unable to join waitlist.");
    return NextResponse.json({ message: response.message }, { status: response.status });
  }
}
