import { format } from "date-fns";

export const BOOKING_TIME_ZONE = "Asia/Kolkata";
export const BOOKING_TIME_ZONE_OFFSET = "+05:30";

export function getLocalDateKey(date = new Date()) {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: BOOKING_TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

export function getLocalMonthKey(date = new Date()) {
  return getLocalDateKey(date).slice(0, 7);
}

export function buildLocalDateTime(dateKey: string, time: string) {
  return new Date(`${dateKey}T${time}:00${BOOKING_TIME_ZONE_OFFSET}`);
}

export function getHoursUntil(dateKey: string, time: string, now = new Date()) {
  return (buildLocalDateTime(dateKey, time).getTime() - now.getTime()) / (1000 * 60 * 60);
}

export function compareDateTimeKeys(
  left: { dateKey: string; startTime: string },
  right: { dateKey: string; startTime: string },
) {
  return left.dateKey.localeCompare(right.dateKey) || left.startTime.localeCompare(right.startTime);
}

export function addMinutesToTime(time: string, minutes: number) {
  const [hourString, minuteString] = time.split(":");
  const baseDate = new Date(2000, 0, 1, Number(hourString), Number(minuteString));
  baseDate.setMinutes(baseDate.getMinutes() + minutes);
  return format(baseDate, "HH:mm");
}

export function addHoursToTime(time: string, hours: number) {
  return addMinutesToTime(time, hours * 60);
}

export function getDateKeyFromMonth(monthKey: string, day: number) {
  const normalizedDay = String(day).padStart(2, "0");
  return `${monthKey}-${normalizedDay}`;
}

export function getMonthKeyFromDateKey(dateKey: string) {
  return dateKey.slice(0, 7);
}
