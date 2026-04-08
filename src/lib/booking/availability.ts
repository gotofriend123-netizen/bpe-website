import type { AvailabilityResponse, DayAvailabilitySummary, PublicSlot } from "@/lib/types/booking";
import { compareDateTimeKeys, getMonthKeyFromDateKey } from "./time";

type SlotLike = {
  id: string;
  space: string;
  dateKey: string;
  startTime: string;
  endTime: string;
  status: string;
  peakTime: boolean;
  priceModifier: number;
  label: string | null;
  bufferBefore: number;
  bufferAfter: number;
  note: string | null;
  tag: string | null;
};

function mapSlotStatus(status: SlotLike["status"]): PublicSlot["status"] {
  switch (status) {
    case "AVAILABLE":
    case "available":
      return "available";
    case "PENDING":
    case "pending":
      return "pending";
    case "BOOKED":
    case "booked":
      return "booked";
    case "BLOCKED":
    case "blocked":
      return "blocked";
    case "CANCELLED":
    case "cancelled":
      return "cancelled";
    case "RESCHEDULED":
    case "rescheduled":
      return "rescheduled";
    case "BUFFER_BLOCKED":
    case "buffer_blocked":
    case "buffer-blocked":
      return "buffer-blocked";
    case "WAITLIST_ONLY":
    case "waitlist_only":
    case "waitlist-only":
      return "waitlist-only";
    default:
      return "available";
  }
}

export function serializeSlot(slot: SlotLike): PublicSlot {
  return {
    id: slot.id,
    space: slot.space as PublicSlot["space"],
    dateKey: slot.dateKey,
    startTime: slot.startTime,
    endTime: slot.endTime,
    status: mapSlotStatus(slot.status),
    peakTime: slot.peakTime,
    priceModifier: slot.priceModifier,
    label: slot.label,
    bufferBefore: slot.bufferBefore,
    bufferAfter: slot.bufferAfter,
    note: slot.note,
    tag: slot.tag,
  };
}

export function getDayAvailabilitySummary(
  slots: PublicSlot[],
  dateKey: string,
): DayAvailabilitySummary {
  const daySlots = slots.filter((slot) => slot.dateKey === dateKey);
  const availableSlots = daySlots.filter((slot) => slot.status === "available");
  const summary: DayAvailabilitySummary = {
    dateKey,
    totalSlots: daySlots.length,
    availableSlots: availableSlots.length,
    pendingSlots: daySlots.filter((slot) => slot.status === "pending").length,
    bookedSlots: daySlots.filter((slot) => slot.status === "booked").length,
    blockedSlots: daySlots.filter((slot) => slot.status === "blocked").length,
    waitlistOnlySlots: daySlots.filter((slot) => slot.status === "waitlist-only").length,
    peakSlots: daySlots.filter((slot) => slot.peakTime).length,
    status: "unavailable",
    nextAvailableSlot: null,
  };

  if (daySlots.length > 0) {
    if (availableSlots.length === 0) {
      summary.status = "fully-booked";
    } else if (availableSlots.length <= 2) {
      summary.status = "limited";
    } else {
      summary.status = "available";
    }
  }

  return summary;
}

export function getNextAvailableSlot(
  slots: PublicSlot[],
  afterDateKey: string,
  afterTime?: string,
) {
  const orderedSlots = [...slots]
    .filter((slot) => slot.status === "available")
    .sort(compareDateTimeKeys);

  return (
    orderedSlots.find((slot) => {
      if (slot.dateKey > afterDateKey) {
        return true;
      }

      if (slot.dateKey === afterDateKey) {
        if (!afterTime) {
          return true;
        }

        return slot.startTime > afterTime;
      }

      return false;
    }) ?? null
  );
}

export function buildAvailabilityResponse(params: {
  space: AvailabilityResponse["space"];
  month?: string;
  date?: string;
  slots: PublicSlot[];
}): AvailabilityResponse {
  const { space, month, date, slots } = params;
  const filteredSlots = slots.filter((slot) => slot.space === space);

  const days = new Map<string, DayAvailabilitySummary>();
  for (const slot of filteredSlots) {
    const dateKey = slot.dateKey;
    if (month && getMonthKeyFromDateKey(dateKey) !== month) {
      continue;
    }
    if (!days.has(dateKey)) {
      days.set(dateKey, getDayAvailabilitySummary(filteredSlots, dateKey));
    }
  }

  const requestedSlots = date
    ? filteredSlots.filter((slot) => slot.dateKey === date)
    : month
      ? filteredSlots.filter((slot) => getMonthKeyFromDateKey(slot.dateKey) === month)
      : filteredSlots;

  const nextAvailableSlot = getNextAvailableSlot(
    filteredSlots,
    date ?? month ?? filteredSlots[0]?.dateKey ?? "",
  );

  if (date) {
    const daySummary = getDayAvailabilitySummary(filteredSlots, date);
    daySummary.nextAvailableSlot = nextAvailableSlot;
    return {
      space,
      date,
      days: [daySummary],
      slots: requestedSlots,
      nextAvailableSlot,
      fullyBooked: daySummary.status === "fully-booked",
    };
  }

  const dayList = Array.from(days.values()).sort((left, right) =>
    left.dateKey.localeCompare(right.dateKey),
  );
  return {
    space,
    month,
    days: dayList,
    slots: requestedSlots,
    nextAvailableSlot,
    fullyBooked: dayList.length > 0 && dayList.every((day) => day.status === "fully-booked" || day.status === "unavailable"),
  };
}
