export class BookingServiceError extends Error {
  status: number;
  code: string;
  details?: unknown;

  constructor(message: string, status = 400, code = "BOOKING_ERROR", details?: unknown) {
    super(message);
    this.name = "BookingServiceError";
    this.status = status;
    this.code = code;
    this.details = details;
  }
}
