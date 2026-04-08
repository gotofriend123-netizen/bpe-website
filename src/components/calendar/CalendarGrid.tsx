"use client";

import { useEffect, useState } from "react";
import {
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  format,
  isSameDay,
  isSameMonth,
  isToday,
  startOfMonth,
  subMonths,
} from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DayAvailabilitySummary, Space } from "@/lib/types/booking";
import { GlowCard } from "@/components/ui/GlowCard";
import { fetchAvailability } from "@/lib/booking/client";

interface CalendarGridProps {
  space: Space;
  selectedDate: Date;
  onSelectDate: (date: Date) => void;
}

export const CalendarGrid = ({ space, selectedDate, onSelectDate }: CalendarGridProps) => {
  const [currentMonth, setCurrentMonth] = useState(startOfMonth(selectedDate));
  const [monthDays, setMonthDays] = useState<DayAvailabilitySummary[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const daysInMonth = eachDayOfInterval({
    start: startOfMonth(currentMonth),
    end: endOfMonth(currentMonth),
  });

  const paddingDays = Array.from({ length: startOfMonth(currentMonth).getDay() }, (_, index) => index);

  useEffect(() => {
    setCurrentMonth(startOfMonth(selectedDate));
  }, [selectedDate]);

  useEffect(() => {
    let active = true;
    setIsLoading(true);

    fetchAvailability({
      space,
      month: format(currentMonth, "yyyy-MM"),
    })
      .then((data) => {
        if (active) {
          setMonthDays(data.days);
        }
      })
      .catch(() => {
        if (active) {
          setMonthDays([]);
        }
      })
      .finally(() => {
        if (active) {
          setIsLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, [currentMonth, space]);

  const nextMonth = () => setCurrentMonth((current) => addMonths(current, 1));
  const prevMonth = () => setCurrentMonth((current) => subMonths(current, 1));

  const getDayStatus = (date: Date) =>
    monthDays.find((day) => day.dateKey === format(date, "yyyy-MM-dd"))?.status ?? "unavailable";

  return (
    <GlowCard
      className="mx-auto w-full max-w-lg"
      contentClassName="p-6 md:p-8"
      backgroundColor="#09070f"
      borderRadius={30}
    >
      <div className="mb-8 flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight text-white">
          {format(currentMonth, "MMMM yyyy")}
        </h2>
        <div className="flex gap-2">
          <button
            onClick={prevMonth}
            className="rounded-full border border-white/10 p-2 text-white transition-colors hover:bg-white/10"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={nextMonth}
            className="rounded-full border border-white/10 p-2 text-white transition-colors hover:bg-white/10"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      <div className="mb-4 grid grid-cols-7 gap-2 text-center">
        {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => (
          <div key={day} className="text-xs font-semibold uppercase tracking-widest text-gray-500">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-2">
        {paddingDays.map((day) => (
          <div key={`empty-${day}`} className="h-10 w-10 md:h-12 md:w-12" />
        ))}

        {daysInMonth.map((date) => {
          const isSelected = isSameDay(date, selectedDate);
          const isCurrentMonth = isSameMonth(date, currentMonth);
          const isDayToday = isToday(date);
          const status = getDayStatus(date);
          const isPast = date < new Date(new Date().setHours(0, 0, 0, 0));

          let bgClass = "bg-transparent hover:bg-white/5";
          let borderClass = "border-transparent";
          let textClass = isCurrentMonth ? "text-gray-300" : "text-gray-700";
          let indicatorColor = "bg-transparent";

          if (isPast) {
            textClass = "text-gray-800";
            bgClass = "bg-transparent cursor-not-allowed";
          } else {
            if (status === "available") indicatorColor = "bg-green-500";
            if (status === "limited") indicatorColor = "bg-amber-500";
            if (status === "fully-booked") {
              indicatorColor = "bg-red-500";
              textClass = "text-gray-500";
            }
          }

          if (isSelected) {
            bgClass = "bg-white shadow-[0_0_20px_rgba(255,255,255,0.3)]";
            textClass = "text-black font-bold";
            borderClass = "border-white";
          } else if (isDayToday && !isPast) {
            borderClass = "border-white/30";
          }

          return (
            <button
              key={date.toString()}
              onClick={() => !isPast && onSelectDate(date)}
              disabled={isPast}
              className={`relative flex h-10 w-10 flex-col items-center justify-center rounded-xl border transition-all duration-300 md:h-12 md:w-12 ${bgClass} ${borderClass}`}
            >
              <span className={`text-sm ${textClass}`}>{format(date, "d")}</span>
              {!isPast && !isSelected && status !== "unavailable" && (
                <span className={`absolute bottom-2 h-1 w-1 rounded-full ${indicatorColor}`} />
              )}
            </button>
          );
        })}
      </div>

      {isLoading ? (
        <p className="mt-4 text-center text-xs uppercase tracking-[0.3em] text-gray-500">
          Loading availability...
        </p>
      ) : null}

      <div className="mt-8 flex items-center justify-center gap-6 text-xs text-gray-400">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-green-500" /> Available
        </div>
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-amber-500" /> Limited
        </div>
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-red-500" /> Full
        </div>
      </div>
    </GlowCard>
  );
};
