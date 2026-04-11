"use client";

import { useEffect, useMemo, useState } from "react";
import {
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  format,
  startOfMonth,
  subMonths,
} from "date-fns";
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Sparkles,
} from "lucide-react";

import { rescheduleDashboardBookingAction } from "@/app/dashboard/actions";
import { DashboardSubmitButton } from "@/components/dashboard/DashboardSubmitButton";

type RescheduleOption = {
  id: string;
  space: "vsl" | "vsr" | "arcade";
  dateKey: string;
  startTime: string;
  endTime: string;
  peakTime: boolean;
  label: string | null;
  note: string | null;
  priceModifier: number;
};

type RescheduleCalendarPickerProps = {
  bookingId: string;
  spaceLabel: string;
  currentDateKey: string;
  options: RescheduleOption[];
};

const monthFormatter = new Intl.DateTimeFormat("en-IN", {
  timeZone: "Asia/Kolkata",
  month: "long",
  year: "numeric",
});

const dateFormatter = new Intl.DateTimeFormat("en-IN", {
  timeZone: "Asia/Kolkata",
  weekday: "short",
  day: "numeric",
  month: "short",
  year: "numeric",
});

function toCalendarDate(dateKey: string) {
  return new Date(`${dateKey}T00:00:00+05:30`);
}

function formatDateLabel(dateKey: string) {
  return dateFormatter.format(toCalendarDate(dateKey));
}

function sortByDateAndTime(left: RescheduleOption, right: RescheduleOption) {
  return left.dateKey.localeCompare(right.dateKey) || left.startTime.localeCompare(right.startTime);
}

export function RescheduleCalendarPicker({
  bookingId,
  spaceLabel,
  currentDateKey,
  options,
}: RescheduleCalendarPickerProps) {
  const orderedOptions = useMemo(() => [...options].sort(sortByDateAndTime), [options]);

  const optionsByDate = useMemo(() => {
    return orderedOptions.reduce<Record<string, RescheduleOption[]>>((accumulator, option) => {
      if (!accumulator[option.dateKey]) {
        accumulator[option.dateKey] = [];
      }

      accumulator[option.dateKey].push(option);
      return accumulator;
    }, {});
  }, [orderedOptions]);

  const selectableDateKeys = useMemo(
    () => Object.keys(optionsByDate).sort(),
    [optionsByDate],
  );

  const firstDateKey = selectableDateKeys[0] ?? currentDateKey;
  const lastDateKey = selectableDateKeys[selectableDateKeys.length - 1] ?? currentDateKey;

  const [selectedDateKey, setSelectedDateKey] = useState(firstDateKey);
  const [selectedSlotId, setSelectedSlotId] = useState(
    optionsByDate[firstDateKey]?.[0]?.id ?? "",
  );
  const [currentMonth, setCurrentMonth] = useState(startOfMonth(toCalendarDate(firstDateKey)));

  useEffect(() => {
    setSelectedDateKey(firstDateKey);
    setCurrentMonth(startOfMonth(toCalendarDate(firstDateKey)));
  }, [firstDateKey]);

  useEffect(() => {
    const slotsForSelectedDate = optionsByDate[selectedDateKey] ?? [];

    if (slotsForSelectedDate.length === 0) {
      setSelectedSlotId("");
      return;
    }

    setSelectedSlotId((currentValue) => {
      return slotsForSelectedDate.some((slot) => slot.id === currentValue)
        ? currentValue
        : slotsForSelectedDate[0]?.id ?? "";
    });
  }, [optionsByDate, selectedDateKey]);

  const minMonth = startOfMonth(toCalendarDate(firstDateKey));
  const maxMonth = startOfMonth(toCalendarDate(lastDateKey));

  const daysInMonth = eachDayOfInterval({
    start: startOfMonth(currentMonth),
    end: endOfMonth(currentMonth),
  });

  const paddingDays = Array.from(
    { length: startOfMonth(currentMonth).getDay() },
    (_, index) => index,
  );

  const selectedDateSlots = optionsByDate[selectedDateKey] ?? [];
  const selectedSlot =
    selectedDateSlots.find((slot) => slot.id === selectedSlotId) ?? selectedDateSlots[0] ?? null;

  const canMoveToPreviousMonth = currentMonth.getTime() > minMonth.getTime();
  const canMoveToNextMonth = currentMonth.getTime() < maxMonth.getTime();

  if (orderedOptions.length === 0) {
    return (
      <div className="rounded-[1.35rem] border border-white/8 bg-white/[0.03] p-4">
        <p className="text-xs uppercase tracking-[0.24em] text-white/40">
          Confirm reschedule
        </p>
        <p className="mt-3 text-sm leading-7 text-white/60">
          No alternate valid slot is currently available for this booking.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-[1.35rem] border border-white/8 bg-white/[0.03] p-4 sm:p-5">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.24em] text-white/40">
            Confirm reschedule
          </p>
          <h4 className="mt-2 text-lg font-semibold text-white">
            Pick a new date and time
          </h4>
        </div>
        <p className="text-xs leading-6 text-white/45 sm:max-w-[18rem] sm:text-right">
          Only valid future slots in {spaceLabel} are shown here. The same live slot
          rules are used before the booking is updated.
        </p>
      </div>

      <div className="mt-4 space-y-3">
        <div className="rounded-[1.2rem] border border-white/8 bg-black/35 p-3.5 sm:p-4">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="flex h-9 w-9 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.05] text-white/70">
                <CalendarDays className="h-3.5 w-3.5" />
              </span>
              <div>
                <p className="text-[11px] uppercase tracking-[0.22em] text-white/40">
                  Available dates
                </p>
                <p className="mt-1 text-sm font-medium text-white/80">
                  {monthFormatter.format(currentMonth)}
                </p>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => canMoveToPreviousMonth && setCurrentMonth((value) => subMonths(value, 1))}
                disabled={!canMoveToPreviousMonth}
                className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-white/75 transition-colors hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-35"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => canMoveToNextMonth && setCurrentMonth((value) => addMonths(value, 1))}
                disabled={!canMoveToNextMonth}
                className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-white/75 transition-colors hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-35"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-7 gap-1.5 text-center">
            {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => (
              <div
                key={day}
                className="text-[10px] font-semibold uppercase tracking-[0.26em] text-white/28"
              >
                {day}
              </div>
            ))}
          </div>

          <div className="mt-3 grid grid-cols-7 gap-1.5">
            {paddingDays.map((day) => (
              <div key={`pad-${day}`} className="h-9 rounded-xl" />
            ))}

            {daysInMonth.map((day) => {
              const dateKey = format(day, "yyyy-MM-dd");
              const slotsForDay = optionsByDate[dateKey] ?? [];
              const isActive = slotsForDay.length > 0;
              const isSelected = selectedDateKey === dateKey;

              return (
                <button
                  key={dateKey}
                  type="button"
                  disabled={!isActive}
                  onClick={() => isActive && setSelectedDateKey(dateKey)}
                  className={[
                    "relative flex h-9 items-center justify-center rounded-lg border text-xs transition-all duration-200 sm:h-10 sm:text-sm",
                    isSelected
                      ? "border-white bg-white text-black shadow-[0_0_26px_rgba(255,255,255,0.18)]"
                      : isActive
                        ? "border-white/12 bg-white/[0.04] text-white hover:border-white/22 hover:bg-white/[0.08]"
                        : "border-white/[0.04] bg-transparent text-white/18",
                  ].join(" ")}
                >
                  <span>{format(day, "d")}</span>
                  {isActive && !isSelected ? (
                    <span className="absolute bottom-1.5 h-1.5 w-1.5 rounded-full bg-emerald-400/90" />
                  ) : null}
                  {isActive ? (
                    <span className="absolute right-1.5 top-1.5 text-[9px] font-semibold leading-none text-current/70">
                      {slotsForDay.length}
                    </span>
                  ) : null}
                </button>
              );
            })}
          </div>
        </div>

        <div className="rounded-[1.2rem] border border-white/8 bg-black/35 p-3.5 sm:p-4">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-[11px] uppercase tracking-[0.22em] text-white/40">
                Selected date
              </p>
              <p className="mt-1 text-sm font-medium text-white">
                {formatDateLabel(selectedDateKey)}
              </p>
            </div>
            <p className="text-xs leading-6 text-white/45">
              {selectedDateSlots.length} slot{selectedDateSlots.length === 1 ? "" : "s"} ready
            </p>
          </div>

          <div className="mt-4 grid max-h-[17.5rem] gap-3 overflow-y-auto pr-1 sm:grid-cols-2">
            {selectedDateSlots.map((slot) => {
              const isSelected = slot.id === selectedSlotId;

              return (
                <button
                  key={slot.id}
                  type="button"
                  onClick={() => setSelectedSlotId(slot.id)}
                  className={[
                    "rounded-[1.05rem] border p-3.5 text-left transition-all duration-200",
                    isSelected
                      ? "border-white bg-white text-black shadow-[0_0_26px_rgba(255,255,255,0.18)]"
                      : "border-white/10 bg-white/[0.04] text-white hover:border-white/22 hover:bg-white/[0.08]",
                  ].join(" ")}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-base font-semibold">
                        {slot.startTime} - {slot.endTime}
                      </p>
                      <p
                        className={[
                          "mt-2 flex items-center gap-2 text-xs",
                          isSelected ? "text-black/70" : "text-white/55",
                        ].join(" ")}
                      >
                        <Clock3 className="h-3.5 w-3.5" />
                        Same-space reschedule
                      </p>
                    </div>
                    {slot.peakTime ? (
                      <span
                        className={[
                          "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.22em]",
                          isSelected
                            ? "bg-black/10 text-black/80"
                            : "border border-amber-400/20 bg-amber-400/10 text-amber-200",
                        ].join(" ")}
                      >
                        <Sparkles className="h-3 w-3" />
                        Peak
                      </span>
                    ) : null}
                  </div>

                  {slot.label || slot.note ? (
                    <p
                      className={[
                        "mt-3 text-xs leading-6",
                        isSelected ? "text-black/70" : "text-white/52",
                      ].join(" ")}
                    >
                      {slot.label ?? slot.note}
                    </p>
                  ) : null}
                </button>
              );
            })}
          </div>

          <form action={rescheduleDashboardBookingAction} className="mt-4">
            <input type="hidden" name="bookingId" value={bookingId} />
            <input type="hidden" name="slotId" value={selectedSlotId} />

            <div className="rounded-[1.1rem] border border-white/8 bg-white/[0.03] px-4 py-3 text-xs leading-6 text-white/52">
              {selectedSlot ? (
                <>
                  You are about to move this booking to{" "}
                  <span className="font-semibold text-white/75">
                    {formatDateLabel(selectedSlot.dateKey)} · {selectedSlot.startTime} -{" "}
                    {selectedSlot.endTime}
                  </span>
                  . If another guest reserves it first, the system will stop the
                  reschedule and ask you to choose again.
                </>
              ) : (
                <>
                  If another guest reserves this slot before you confirm, the system
                  will stop the reschedule and ask you to choose again.
                </>
              )}
            </div>

            <DashboardSubmitButton variant="reschedule" disabled={!selectedSlotId} />
          </form>
        </div>
      </div>
    </div>
  );
}
