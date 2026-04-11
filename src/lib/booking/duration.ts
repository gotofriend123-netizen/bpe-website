export const FALLBACK_BOOKING_DURATION_HOURS = 2;

export function normalizeBookingDurationHours(value: number | null | undefined) {
  const safeValue = Number.isFinite(value) ? Math.trunc(Number(value)) : FALLBACK_BOOKING_DURATION_HOURS;
  return Math.min(12, Math.max(1, safeValue));
}

export function formatBookingDurationLabel(hours: number) {
  return `${hours} hour${hours === 1 ? "" : "s"}`;
}
