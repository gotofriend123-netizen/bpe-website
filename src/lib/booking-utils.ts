import { format, parseISO } from "date-fns";
import type { BookingTypeId } from "@/config/data";
import type { Space } from "@/lib/types/booking";

export const SPACE_LABELS: Record<Space, string> = {
  vsl: "Verve Studio Left",
  vsr: "Verve Studio Right",
  arcade: "The Arcade",
};

export const SPACE_TO_BOOKING_TYPE: Record<Space, BookingTypeId> = {
  vsl: "verve-studio-left",
  vsr: "verve-studio-right",
  arcade: "the-arcade",
};

export const BOOKING_TYPE_TO_SPACE: Record<BookingTypeId, Space> = {
  "verve-studio-left": "vsl",
  "verve-studio-right": "vsr",
  "the-arcade": "arcade",
};

export function isSpace(value: string | null | undefined): value is Space {
  return value === "vsl" || value === "vsr" || value === "arcade";
}

export function isBookingTypeId(
  value: string | null | undefined,
): value is BookingTypeId {
  return (
    value === "verve-studio-left" ||
    value === "verve-studio-right" ||
    value === "the-arcade"
  );
}

export function formatLocalDateKey(date: Date) {
  return format(date, "yyyy-MM-dd");
}

export function formatIsoDate(
  date: string,
  dateFormat = "EEEE, MMMM do, yyyy",
) {
  return format(parseISO(date), dateFormat);
}

export function addHoursToTime(time: string, hours: number) {
  const [hourString, minuteString] = time.split(":");
  const baseDate = new Date(2000, 0, 1, Number(hourString), Number(minuteString));
  baseDate.setHours(baseDate.getHours() + hours);

  return format(baseDate, "HH:mm");
}

export function bookingTypeToSpace(bookingType: BookingTypeId) {
  return BOOKING_TYPE_TO_SPACE[bookingType];
}

export function spaceToBookingType(space: Space) {
  return SPACE_TO_BOOKING_TYPE[space];
}

export function resolveBookingTypeFromParams({
  bookingType,
  space,
  studio,
}: {
  bookingType?: string | null;
  space?: string | null;
  studio?: string | null;
}) {
  if (isBookingTypeId(bookingType)) {
    return bookingType;
  }

  if (isSpace(space)) {
    return spaceToBookingType(space);
  }

  if (studio === "arcade") {
    return "the-arcade";
  }

  if (studio === "verve-left") {
    return "verve-studio-left";
  }

  if (studio === "verve-right") {
    return "verve-studio-right";
  }

  return null;
}

export function resolveSpaceFromParams({
  bookingType,
  space,
  studio,
}: {
  bookingType?: string | null;
  space?: string | null;
  studio?: string | null;
}) {
  if (isSpace(space)) {
    return space;
  }

  const resolvedBookingType = resolveBookingTypeFromParams({
    bookingType,
    space,
    studio,
  });

  if (resolvedBookingType) {
    return bookingTypeToSpace(resolvedBookingType);
  }

  if (studio === "verve") {
    return "vsl";
  }

  return null;
}

export function getSpaceLabel(value: Space | BookingTypeId | null | undefined) {
  if (!value) {
    return null;
  }

  if (isSpace(value)) {
    return SPACE_LABELS[value];
  }

  if (isBookingTypeId(value)) {
    return SPACE_LABELS[bookingTypeToSpace(value)];
  }

  return null;
}

export function getSpaceLabelFromParams({
  bookingType,
  space,
  studio,
}: {
  bookingType?: string | null;
  space?: string | null;
  studio?: string | null;
}) {
  const resolvedBookingType = resolveBookingTypeFromParams({
    bookingType,
    space,
    studio,
  });

  if (resolvedBookingType) {
    return getSpaceLabel(resolvedBookingType);
  }

  if (studio === "verve") {
    return "Verve Studio";
  }

  return null;
}
