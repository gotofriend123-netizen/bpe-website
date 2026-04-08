import { NextResponse } from "next/server";
import { isSpace } from "@/lib/booking-utils";
import { getAvailabilityForDate, getAvailabilityForMonth } from "@/lib/booking/service";
import { getPublicApiError } from "@/lib/server-errors";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const spaceParam = url.searchParams.get("space");
    const date = url.searchParams.get("date");
    const month = url.searchParams.get("month");

    if (!spaceParam || !isSpace(spaceParam)) {
      return NextResponse.json(
        { message: "A valid space is required." },
        { status: 400 },
      );
    }

    const payload = date
      ? await getAvailabilityForDate(spaceParam, date)
      : await getAvailabilityForMonth(spaceParam, month ?? new Date().toISOString().slice(0, 7));

    return NextResponse.json(payload, {
      headers: {
        "Cache-Control": "no-store, max-age=0",
      },
    });
  } catch (error) {
    const response = getPublicApiError(error, "Unable to load availability.");
    return NextResponse.json({ message: response.message }, { status: response.status });
  }
}
