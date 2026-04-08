"use client";

import { useState } from "react";
import { format } from "date-fns";
import { Lock, Unlock, Settings2, Info } from "lucide-react";
import { SlotStatus, Space } from "@/lib/types/booking";
import { useBookingStore } from "@/lib/store/bookingStore";
import { formatLocalDateKey } from "@/lib/booking-utils";
import { GlowCard } from "@/components/ui/GlowCard";

interface AdminDayManagerProps {
  space: Space;
  date: Date;
}

export const AdminDayManager = ({ space, date }: AdminDayManagerProps) => {
  const dateStr = formatLocalDateKey(date);
  const allSlots = useBookingStore(s => s.slots);
  const slots = allSlots.filter(slot => slot.space === space && slot.date === dateStr);
  const updateSlotStatus = useBookingStore(s => s.updateSlotStatus);
  const bulkBlockDay = useBookingStore(s => s.bulkBlockDay);
  const bulkOpenDay = useBookingStore(s => s.bulkOpenDay);

  const [isEditing, setIsEditing] = useState(false);

  const isFullyBlocked = slots.length > 0 && slots.every(s => s.status === 'blocked');
  
  const handleToggleBlockDay = () => {
     if (isFullyBlocked) {
       bulkOpenDay(space, dateStr);
     } else {
       bulkBlockDay(space, dateStr);
     }
  };

  const statusColors: Record<string, string> = {
    available: "bg-green-500/20 text-green-400 border-green-500/30",
    booked: "bg-blue-500/20 text-blue-400 border-blue-500/30",
    blocked: "bg-red-500/20 text-red-500 border-red-500/30",
    'buffer-blocked': "bg-purple-500/20 text-purple-400 border-purple-500/30"
  };

  return (
    <GlowCard
      className="h-full"
      contentClassName="relative flex h-full flex-col overflow-hidden p-6 lg:p-8"
      backgroundColor="#0b0812"
    >
      
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-red-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />

      <div className="flex justify-between items-center mb-6 relative z-10">
        <div>
           <h3 className="text-2xl font-bold text-white tracking-tight">{format(date, 'MMMM do, yyyy')}</h3>
           <p className="text-gray-400 text-sm mt-1">{slots.length} Slots Generated</p>
        </div>
        <button 
          onClick={() => setIsEditing(!isEditing)}
          className={`px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 transition-colors ${
            isEditing ? "bg-white text-black" : "bg-white/5 text-gray-300 hover:bg-white/10"
          }`}
        >
          <Settings2 size={16} /> {isEditing ? "Done" : "Edit Slots"}
        </button>
      </div>

      <div className="flex gap-4 mb-6 relative z-10">
         <button 
           onClick={handleToggleBlockDay}
           className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all border ${
             isFullyBlocked 
               ? "bg-green-500/10 text-green-500 border-green-500/20 hover:bg-green-500/20"
               : "bg-red-500/10 text-red-500 border-red-500/20 hover:bg-red-500/20"
           }`}
         >
           {isFullyBlocked ? <><Unlock size={16}/> Open Entire Day</> : <><Lock size={16}/> Block Entire Day</>}
         </button>
      </div>

      <div className="space-y-3 overflow-y-auto max-h-[400px] pr-2 custom-scrollbar relative z-10">
        {slots.map(slot => (
           <div key={slot.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-[#1a1a1a] border border-white/5 rounded-2xl gap-4">
             <div>
                <span className="text-white font-bold">{slot.startTime} &mdash; {slot.endTime}</span>
                {slot.label && <span className="ml-2 text-xs uppercase text-amber-500 font-bold bg-amber-500/10 px-2 py-0.5 rounded">{slot.label}</span>}
             </div>

             <div className="flex items-center gap-3">
                <span className={`px-2 py-1 text-xs font-bold uppercase rounded border ${statusColors[slot.status] || 'bg-gray-500/20 text-gray-400 border-gray-500/30'}`}>
                  {slot.status}
                </span>

                {isEditing && (
                  <select
                    value={slot.status}
                    onChange={(e) =>
                      updateSlotStatus(slot.id, e.target.value as SlotStatus)
                    }
                    className="bg-black border border-white/20 text-white text-xs rounded-lg px-2 py-1 focus:outline-none"
                  >
                     <option value="available">Available</option>
                     <option value="blocked">Blocked</option>
                     <option value="buffer-blocked">Buffer Blocked</option>
                     <option value="booked" disabled>Booked (Customer)</option>
                  </select>
                )}
             </div>
           </div>
        ))}
        {slots.length === 0 && (
          <div className="text-center py-10 text-gray-500 flex flex-col items-center">
             <Info className="mb-2 opacity-50" />
             <p>No slots provisioned for this date.</p>
          </div>
        )}
      </div>

    </GlowCard>
  );
};
