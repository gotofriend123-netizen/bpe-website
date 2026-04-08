import type { AvailabilityResponse, BookingResponse, Space } from "@/lib/types/booking";

type AvailabilityParams = {
  space: Space;
  date?: string;
  month?: string;
};

export class BookingClientError extends Error {
  status?: number;
  code?: string;
  details?: unknown;

  constructor(message: string, options?: { status?: number; code?: string; details?: unknown }) {
    super(message);
    this.name = "BookingClientError";
    this.status = options?.status;
    this.code = options?.code;
    this.details = options?.details;
  }
}

async function parseJsonResponse<T>(response: Response): Promise<T> {
  const contentType = response.headers.get("content-type");
  if (!contentType?.includes("application/json")) {
    const text = await response.text();
    throw new Error(text || "Unexpected server response.");
  }

  return response.json() as Promise<T>;
}

export async function fetchAvailability(params: AvailabilityParams) {
  const searchParams = new URLSearchParams({ space: params.space });
  if (params.date) {
    searchParams.set("date", params.date);
  }
  if (params.month) {
    searchParams.set("month", params.month);
  }

  const response = await fetch(`/api/availability?${searchParams.toString()}`, {
    method: "GET",
    cache: "no-store",
  });

  if (!response.ok) {
    const payload = await parseJsonResponse<{ message?: string }>(response).catch(() => null);
    throw new Error(payload?.message || "Unable to load availability.");
  }

  return parseJsonResponse<AvailabilityResponse>(response);
}

export async function createBooking(payload: Record<string, unknown>) {
  const response = await fetch("/api/book", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
    cache: "no-store",
  });

  const data = await parseJsonResponse<BookingResponse & { message?: string }>(response);

  if (!response.ok) {
    throw new BookingClientError(data.message || "Unable to create booking.", {
      status: response.status,
      code: (data as { code?: string }).code,
      details: (data as { details?: unknown }).details,
    });
  }

  return data;
}

export async function joinWaitlist(payload: Record<string, unknown>) {
  const response = await fetch("/api/waitlist", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
    cache: "no-store",
  });

  const data = await parseJsonResponse<{ message?: string }>(response);
  if (!response.ok) {
    throw new BookingClientError(data.message || "Unable to join waitlist.", {
      status: response.status,
      details: data,
    });
  }

  return data;
}
