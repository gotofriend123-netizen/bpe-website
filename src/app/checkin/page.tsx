"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { QrCode, CheckCircle, Clock, MapPin, AlertCircle } from "lucide-react";

export default function CheckinPage() {
  const searchParams = useSearchParams();
  const qrCode = searchParams.get("qr");
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<"idle" | "checking_in" | "checked_in" | "checked_out">("idle");
  const [timer, setTimer] = useState<number>(0);
  const [checkinTime, setCheckinTime] = useState<Date | null>(null);

  useEffect(() => {
    const timerInterval = setInterval(() => {
      if (checkinTime) {
        setTimer(Math.floor((Date.now() - checkinTime.getTime()) / 1000));
      }
    }, 1000);
    
    return () => clearInterval(timerInterval);
  }, [checkinTime]);

  useEffect(() => {
    if (!qrCode) {
      setError("Please scan a valid QR code from the venue.");
      setLoading(false);
    } else {
      setTimeout(() => setLoading(false), 500);
    }
  }, [qrCode]);

  function formatTimer(seconds: number) {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  }

  function handleStartCheckIn() {
    setStatus("checking_in");
    setTimeout(() => {
      setCheckinTime(new Date());
      setStatus("checked_in");
    }, 1000);
  }

  function handleCheckOut() {
    setStatus("checked_out");
    setCheckinTime(null);
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

  if (error) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-6">
        <div className="max-w-md text-center">
          <div className="w-20 h-20 rounded-full bg-rose-500/20 flex items-center justify-center mx-auto mb-6">
            <AlertCircle className="w-10 h-10 text-rose-400" />
          </div>
          <h1 className="text-2xl font-semibold text-white mb-3">Unable to Check In</h1>
          <p className="text-white/60 mb-8">{error}</p>
          <div className="space-y-3">
            <Link href="/login" className="block w-full bg-white text-black py-3.5 rounded-full font-semibold text-center">
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

        <div className="bg-[#111111] rounded-2xl border border-white/10 p-5 mb-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center">
              <MapPin className="w-6 h-6 text-[#d8f24d]" />
            </div>
            <div>
              <p className="text-sm text-white/50">Venue</p>
              <p className="font-semibold">The Arcade</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center">
              <Clock className="w-6 h-6 text-[#d8f24d]" />
            </div>
            <div>
              <p className="text-sm text-white/50">Time</p>
              <p className="font-semibold">10:00 AM - 12:00 PM</p>
            </div>
          </div>
        </div>

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

        {status === "idle" && (
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
          <Link
            href="/"
            className="block w-full bg-white text-black py-4 rounded-full font-semibold text-lg text-center"
          >
            Go to Home
          </Link>
        )}

        <div className="mt-8 pt-6 border-t border-white/10">
          <p className="text-xs text-white/40 text-center">
            QR Code: {qrCode}
          </p>
        </div>
      </div>
    </div>
  );
}