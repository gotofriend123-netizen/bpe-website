"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Camera, CameraOff, CheckCircle, Clock, MapPin, Timer, X } from "lucide-react";
import { getQRCodeForVenue, validateCheckinEligibility, processCheckIn, processCheckOut } from "@/lib/checkin/service";

type Booking = {
  id: string;
  reference: string;
  space: string;
  dateKey: string;
  startTime: string;
  endTime: string;
  packageLabel?: string;
};

type Checkin = {
  id: string;
  status: string;
  checkedInAt?: string;
  checkedOutAt?: string;
  actualDurationMinutes?: number;
};

type Props = {
  venue: string;
};

export default function CheckinPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const qrCode = searchParams.get("qr");
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [booking, setBooking] = useState<Booking | null>(null);
  const [checkin, setCheckin] = useState<Checkin | null>(null);
  const [eligible, setEligible] = useState(false);
  const [timer, setTimer] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    async function checkEligibility() {
      try {
        setLoading(true);
        
        const response = await fetch(`/api/checkin/validate?qr=${qrCode || ""}`);
        const data = await response.json();
        
        if (!data.valid) {
          setError(data.message);
          setEligible(false);
        } else {
          setBooking(data.booking);
          setCheckin(data.checkin);
          setEligible(true);
        }
      } catch (err) {
        setError("Failed to validate check-in. Please try again.");
      } finally {
        setLoading(false);
      }
    }
    
    checkEligibility();
  }, [qrCode]);

  useEffect(() => {
    if (!checkin?.checkedInAt || checkin?.status === "checked_out") return;
    
    const interval = setInterval(() => {
      const start = new Date(checkin.checkedInAt).getTime();
      const now = Date.now();
      const diff = Math.floor((now - start) / 1000);
      
      const hours = Math.floor(diff / 3600);
      const minutes = Math.floor((diff % 3600) / 60);
      const seconds = diff % 60;
      
      setTimer(
        `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
      );
    }, 1000);
    
    return () => clearInterval(interval);
  }, [checkin]);

  async function handleCheckIn() {
    if (!booking) return;
    setProcessing(true);
    try {
      const response = await fetch("/api/checkin/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookingId: booking.id }),
      });
      const data = await response.json();
      
      if (data.success) {
        setCheckin(data.checkin);
        setSuccess("Check-in started! Timer running.");
      } else {
        setError(data.message || "Failed to start check-in");
      }
    } catch (err) {
      setError("Failed to start check-in");
    } finally {
      setProcessing(false);
    }
  }

  async function handleCheckOut() {
    if (!booking) return;
    setProcessing(true);
    try {
      const response = await fetch("/api/checkin/end", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookingId: booking.id }),
      });
      const data = await response.json();
      
      if (data.success) {
        setCheckin(data.checkin);
        setSuccess(`Checked out! Duration: ${data.checkin.actualDurationMinutes} minutes`);
      } else {
        setError(data.message || "Failed to check out");
      }
    } catch (err) {
      setError("Failed to check out");
    } finally {
      setProcessing(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-2 border-[#d8f24d] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="mt-4 text-white/60">Validating...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-6">
        <div className="max-w-md text-center">
          <div className="w-16 h-16 rounded-full bg-rose-500/20 flex items-center justify-center mx-auto mb-4">
            <X className="w-8 h-8 text-rose-400" />
          </div>
          <h1 className="text-xl font-semibold text-white mb-2">Check-In Failed</h1>
          <p className="text-white/60 mb-6">{error}</p>
          <Link href="/login" className="inline-block bg-white text-black px-6 py-3 rounded-full font-semibold">
            Log In to Continue
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-semibold">Check-In</h1>
          <p className="text-white/60 mt-1">Arcade Community Hall</p>
        </div>

        {success && (
          <div className="bg-green-500/10 border border-green-500/30 rounded-2xl p-4 mb-6">
            <p className="text-green-400 text-center">{success}</p>
          </div>
        )}

        {booking && (
          <div className="bg-[#111111] rounded-2xl border border-white/10 p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-[10px] uppercase tracking-widest text-white/50">Booking</span>
              <span className="text-xs text-[#d8f24d]">{booking.reference}</span>
            </div>
            
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-3">
                <MapPin className="w-4 h-4 text-white/50" />
                <span>{booking.space}</span>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="w-4 h-4 text-white/50" />
                <span>{booking.dateKey} • {booking.startTime} - {booking.endTime}</span>
              </div>
            </div>
          </div>
        )}

        {timer && (
          <div className="bg-[#111111] rounded-2xl border border-[#d8f24d]/30 p-6 mb-6 text-center">
            <p className="text-[10px] uppercase tracking-widest text-white/50 mb-2">Active Session</p>
            <div className="text-4xl font-mono font-bold text-[#d8f24d]">{timer}</div>
          </div>
        )}

        {eligible && !checkin && (
          <button
            onClick={handleCheckIn}
            disabled={processing}
            className="w-full bg-[#d8f24d] text-black py-4 rounded-full font-semibold text-lg disabled:opacity-50"
          >
            {processing ? "Processing..." : "Start Check-In"}
          </button>
        )}

        {checkin?.status === "checked_in" && (
          <button
            onClick={handleCheckOut}
            disabled={processing}
            className="w-full bg-rose-500 text-white py-4 rounded-full font-semibold text-lg disabled:opacity-50"
          >
            {processing ? "Processing..." : "Check-Out"}
          </button>
        )}
      </div>
    </div>
  );
}