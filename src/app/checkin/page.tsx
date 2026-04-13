"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { QrCode, CheckCircle, Clock, AlertCircle, User } from "lucide-react";

type Booking = {
  id: string;
  reference: string;
  space: string;
  dateKey: string;
  startTime: string;
  endTime: string;
  packageLabel?: string;
};

type ValidationResult = {
  valid: boolean;
  error?: string;
  message?: string;
  booking?: Booking;
};

export default function CheckinPage() {
  const searchParams = useSearchParams();
  const qrCode = searchParams.get("qr");
  
  const [loading, setLoading] = useState(true);
  const [validation, setValidation] = useState<ValidationResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<"idle" | "checking_in" | "checked_in" | "checked_out">("idle");
  const [timer, setTimer] = useState<number>(0);
  const [checkinTime, setCheckinTime] = useState<Date | null>(null);
  const [notLoggedIn, setNotLoggedIn] = useState(false);

  useEffect(() => {
    async function validateCheckin() {
      try {
        const response = await fetch(`/api/checkin/validate?qr=${qrCode || ""}`);
        const data = await response.json();
        
        if (response.status === 401) {
          setNotLoggedIn(true);
          setError(data.message || "Please log in to continue check-in.");
        } else if (!data.valid) {
          setError(data.message || "Unable to check in.");
        } else {
          setValidation(data);
        }
      } catch {
        setError("Failed to validate. Please try again.");
      } finally {
        setLoading(false);
      }
    }
    
    validateCheckin();
  }, [qrCode]);

  useEffect(() => {
    const timerInterval = setInterval(() => {
      if (checkinTime) {
        setTimer(Math.floor((Date.now() - checkinTime.getTime()) / 1000));
      }
    }, 1000);
    
    return () => clearInterval(timerInterval);
  }, [checkinTime]);

  function formatTimer(seconds: number) {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  }

  async function handleStartCheckIn() {
    if (!validation?.booking) return;
    
    setStatus("checking_in");
    try {
      const response = await fetch("/api/checkin/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookingId: validation.booking.id }),
      });
      const data = await response.json();
      
      if (data.success) {
        setCheckinTime(new Date());
        setStatus("checked_in");
      } else {
        setError(data.message || "Failed to check in");
        setStatus("idle");
      }
    } catch {
      setError("Network error. Please try again.");
      setStatus("idle");
    }
  }

  async function handleCheckOut() {
    if (!validation?.booking) return;
    
    try {
      const response = await fetch("/api/checkin/end", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookingId: validation.booking.id }),
      });
      const data = await response.json();
      
      if (data.success) {
        setStatus("checked_out");
        setCheckinTime(null);
      } else {
        setError(data.message || "Failed to check out");
      }
    } catch {
      setError("Network error. Please try again.");
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-2 border-[#d8f24d] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="mt-4 text-white/60">Validating QR Code...</p>
        </div>
      </div>
    );
  }

  if (notLoggedIn || error) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-6">
        <div className="max-w-md text-center">
          <div className="w-20 h-20 rounded-full bg-rose-500/20 flex items-center justify-center mx-auto mb-6">
            <AlertCircle className="w-10 h-10 text-rose-400" />
          </div>
          <h1 className="text-2xl font-semibold text-white mb-3">Unable to Check In</h1>
          <p className="text-white/60 mb-8">{error}</p>
          <div className="space-y-3">
            <Link href={`/login?next=/checkin?qr=${qrCode || ""}`} className="block w-full bg-white text-black py-3.5 rounded-full font-semibold text-center">
              Log In to Continue
            </Link>
            <Link href="/booking" className="block w-full border border-white/20 text-white py-3.5 rounded-full font-semibold text-center">
              Book a Slot First
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-full bg-[#d8f24d]/10 flex items-center justify-center mx-auto mb-4">
            <QrCode className="w-8 h-8 text-[#d8f24d]" />
          </div>
          <h1 className="text-2xl font-semibold">Check-In</h1>
          <p className="text-white/60 mt-1">Arcade Community Hall</p>
        </div>

        {validation?.booking && (
          <div className="bg-[#111111] rounded-2xl border border-white/10 p-5 mb-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-[10px] uppercase tracking-widest text-white/50">Booking</span>
              <span className="text-xs text-[#d8f24d]">{validation.booking.reference}</span>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <User className="w-4 h-4 text-white/50" />
                <span className="text-sm">Arcade Community Hall</span>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="w-4 h-4 text-white/50" />
                <span className="text-sm">{validation.booking.dateKey} • {validation.booking.startTime} - {validation.booking.endTime}</span>
              </div>
            </div>
          </div>
        )}

        {status === "checked_in" && (
          <div className="bg-[#111111] rounded-2xl border border-[#d8f24d]/30 p-6 mb-6 text-center">
            <p className="text-[10px] uppercase tracking-widest text-[#d8f24d] mb-2">Active Session</p>
            <div className="text-5xl font-mono font-bold text-[#d8f24d]">
              {formatTimer(timer)}
            </div>
          </div>
        )}

        {status === "checked_out" && (
          <div className="bg-green-500/10 rounded-2xl border border-green-500/30 p-6 mb-6 text-center">
            <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-3" />
            <p className="text-lg font-semibold text-green-400">Checked Out Successfully</p>
            <p className="text-white/60 mt-1">Thank you for visiting!</p>
          </div>
        )}

        {status === "idle" && validation?.valid && (
          <button
            onClick={handleStartCheckIn}
            className="w-full bg-[#d8f24d] text-black py-4 rounded-full font-semibold text-lg hover:bg-[#c4d244] transition-colors"
          >
            Start Check-In
          </button>
        )}

        {status === "checking_in" && (
          <button disabled className="w-full bg-[#d8f24d]/50 text-black py-4 rounded-full font-semibold text-lg">
            Starting...
          </button>
        )}

        {status === "checked_in" && (
          <button
            onClick={handleCheckOut}
            className="w-full bg-rose-500 text-white py-4 rounded-full font-semibold text-lg hover:bg-rose-600 transition-colors"
          >
            Check-Out
          </button>
        )}

        {status === "checked_out" && (
          <Link href="/" className="block w-full bg-white text-black py-4 rounded-full font-semibold text-lg text-center">
            Go to Home
          </Link>
        )}
      </div>
    </div>
  );
}