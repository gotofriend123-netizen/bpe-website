"use client";

import { useEffect, useState } from "react";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import { Space, PublicSlot } from "@/lib/types/booking";
import { WaitlistForm } from "./WaitlistForm";
import { MoveRight, Zap, Info, Clock, AlertCircle } from "lucide-react";
import { formatIsoDate } from "@/lib/booking-utils";
import { fetchAvailability } from "@/lib/booking/client";

interface TimeSlotListProps {
  space: Space;
  selectedDate: Date;
}

export const TimeSlotList = ({ space, selectedDate }: TimeSlotListProps) => {
  const router = useRouter();
  const dateStr = format(selectedDate, 'yyyy-MM-dd');
  const [slots, setSlots] = useState<PublicSlot[]>([]);
  const [nextAvailable, setNextAvailable] = useState<PublicSlot | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [waitlistJoined, setWaitlistJoined] = useState(false);

  useEffect(() => {
    setSelectedSlot(null);
    setWaitlistJoined(false);
    setIsLoading(true);

    let active = true;

    fetchAvailability({ space, date: dateStr })
      .then((data) => {
        if (!active) {
          return;
        }

        setSlots(data.slots);
        setNextAvailable(data.nextAvailableSlot);
      })
      .catch(() => {
        if (active) {
          setSlots([]);
          setNextAvailable(null);
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
  }, [dateStr, space]);

  // Computed states
  const availableSlots = slots.filter(s => s.status === 'available');
  const isFullyBooked = slots.length > 0 && availableSlots.length === 0;
  const isUnavailable = slots.length === 0 || selectedDate < new Date(new Date().setHours(0,0,0,0));

  const handleContinue = () => {
    if (!selectedSlot) return;
    const slot = availableSlots.find(s => s.id === selectedSlot);
    if (!slot) return;
    
    router.push(`/booking?space=${space}&date=${dateStr}&time=${slot.startTime}&slotId=${slot.id}`);
  };

  if (isUnavailable) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center text-center p-8 border border-white/10 rounded-3xl bg-white/5">
        <AlertCircle className="w-12 h-12 text-gray-500 mb-4" />
        <h3 className="text-xl font-bold text-white mb-2">Date Unavailable</h3>
        <p className="text-gray-400">Trading dates far into the future or the past are currently locked.</p>
      </div>
    );
  }

  if (isFullyBooked) {
    return (
      <div className="w-full flex w-full flex-col">
        <div className="p-6 border border-red-500/20 bg-red-500/5 rounded-3xl text-center mb-6">
           <h3 className="text-2xl font-bold text-red-400 mb-2">Fully Booked</h3>
           <p className="text-gray-300">There are no available slots directly matching your criteria for this date.</p>
        </div>
        
        {nextAvailable && (
          <div className="p-6 border border-white/10 bg-[#0a0a0a] rounded-3xl shadow-xl flex items-center justify-between mb-6">
            <div className="text-left">
              <span className="text-xs uppercase tracking-widest text-green-400 font-bold block mb-1">Next Available Slot</span>
              <span className="text-white font-bold">{formatIsoDate(nextAvailable.dateKey, 'EEEE, MMMM do')} at {nextAvailable.startTime}</span>
            </div>
            <button 
              onClick={() => router.push(`/booking?space=${space}&date=${nextAvailable!.dateKey}&time=${nextAvailable!.startTime}&slotId=${nextAvailable!.id}`)}
              className="px-6 py-2 bg-white text-black font-bold rounded-full text-sm hover:scale-105 transition-transform"
            >
              Book This
            </button>
          </div>
        )}

        {!waitlistJoined ? (
          <WaitlistForm space={space} date={dateStr} onJoined={() => setWaitlistJoined(true)} />
        ) : (
          <div className="p-6 bg-green-500/10 border border-green-500/20 rounded-3xl text-green-400 text-center font-bold">
            You have successfully joined the waitlist for {format(selectedDate, 'MMM do')}. We will notify you if a slot opens up!
          </div>
        )}
      </div>
    );
  }

  return (
      <div className="w-full flex flex-col h-full">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold text-white tracking-tight">
            {format(selectedDate, 'EEEE, MMMM do')}
          </h3>
          <span className="text-sm font-semibold text-gray-400">{availableSlots.length} Slots Available</span>
        </div>

      {isLoading ? (
        <div className="mb-6 rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-gray-400">
          Loading slots...
        </div>
      ) : null}

      <div className="space-y-3 mb-8 overflow-y-auto max-h-[400px] pr-2 custom-scrollbar">
        {slots.map(slot => {
          const isAvailable = slot.status === 'available';
          const isSelected = selectedSlot === slot.id;
          
          if (!isAvailable && slot.status !== 'buffer-blocked') {
            // we show booked/blocked as greyed out
            return (
              <div key={slot.id} className="w-full flex items-center justify-between p-4 rounded-2xl border border-white/5 bg-transparent opacity-40 cursor-not-allowed">
                <span className="text-gray-500 font-bold">{slot.startTime} &mdash; {slot.endTime}</span>
                <span className="text-xs font-semibold text-gray-600 uppercase">Unavailable</span>
              </div>
            );
          }

          if (!isAvailable) return null; // hide invisible buffer blocks completely

          return (
            <button
              key={slot.id}
              onClick={() => setSelectedSlot(slot.id)}
              className={`w-full flex items-center justify-between p-4 rounded-2xl border transition-all duration-300 text-left ${
                isSelected 
                  ? "bg-white border-white text-black shadow-[0_0_30px_rgba(255,255,255,0.2)]" 
                  : "bg-[#0a0a0a] border-white/10 text-white hover:border-white/30 hover:bg-white/5"
              }`}
            >
              <div>
                <span className="font-bold text-lg block mb-1">{slot.startTime} &mdash; {slot.endTime}</span>
                <span className={`text-xs flex items-center gap-1 ${isSelected ? "text-gray-800" : "text-gray-400"}`}>
                  <Clock size={12} /> 2 Hours
                </span>
              </div>
              
              {slot.peakTime && (
                <div className={`flex flex-col items-end text-xs font-bold ${isSelected ? "text-black" : "text-amber-500"}`}>
                  <span className="flex items-center gap-1 mb-1"><Zap size={14} /> {slot.label || "Peak Time"}</span>
                  <span className="opacity-70">Premium Rate</span>
                </div>
              )}
            </button>
          );
        })}
      </div>

      <div className="mt-auto">
        <button
          onClick={handleContinue}
          disabled={!selectedSlot}
          className={`w-full flex items-center justify-center gap-2 py-5 rounded-2xl font-bold text-lg transition-all duration-300 ${
            selectedSlot 
              ? "bg-transparent backdrop-blur-3xl border-2 border-white text-white shadow-[0_0_30px_rgba(255,255,255,0.2)] hover:bg-white hover:text-black" 
              : "bg-white/5 border border-white/10 text-gray-500 cursor-not-allowed"
          }`}
        >
          Continue to Booking {selectedSlot && <MoveRight className="w-5 h-5" />}
        </button>
        {selectedSlot && (
          <p className="text-center text-xs text-gray-500 mt-4 flex items-center justify-center gap-2">
            <Info size={14} /> You will not be charged yet.
          </p>
        )}
      </div>
    </div>
  );
};
