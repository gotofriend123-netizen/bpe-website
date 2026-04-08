"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Space } from "@/lib/types/booking";
import { GlowCard } from "@/components/ui/GlowCard";
import { joinWaitlist } from "@/lib/booking/client";

interface WaitlistFormProps {
  space: Space;
  date: string; // YYYY-MM-DD
  onJoined: () => void;
}

export const WaitlistForm = ({ space, date, onJoined }: WaitlistFormProps) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await joinWaitlist({
        space,
        date,
        name,
        email,
        phone,
      });
      toast.success("You’ve joined the waitlist.");
      onJoined();
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to join waitlist.";
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <GlowCard
      className="mt-6"
      contentClassName="p-6"
      backgroundColor="#09070f"
      borderRadius={30}
    >
      <h3 className="text-xl font-bold text-white mb-2">Join the Waitlist</h3>
      <p className="text-gray-400 text-sm mb-6">This date is fully booked. Join the waitlist and we will contact you if a slot opens up.</p>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Full Name</label>
          <input 
            type="text" 
            required 
            value={name}
            onChange={e => setName(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-white/40 transition-colors"
            placeholder="John Doe"
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Email Address</label>
            <input 
              type="email" 
              required 
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-white/40 transition-colors"
              placeholder="john@example.com"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Phone Number</label>
            <input 
              type="tel" 
              required 
              value={phone}
              onChange={e => setPhone(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-white/40 transition-colors"
              placeholder="+1 234 567 890"
            />
          </div>
        </div>
        <button 
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-white text-black font-bold py-4 rounded-xl hover:bg-gray-200 transition-colors shadow-[0_0_20px_rgba(255,255,255,0.2)]"
        >
          {isSubmitting ? "Joining..." : "Join Waitlist"}
        </button>
      </form>
    </GlowCard>
  );
};
