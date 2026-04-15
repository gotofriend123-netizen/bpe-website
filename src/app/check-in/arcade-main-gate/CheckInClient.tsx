"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import Link from "next/link";
import {
  QrCode,
  CheckCircle,
  Clock,
  AlertCircle,
  MapPin,
  Calendar,
  Timer,
  Loader2,
  LogOut,
  User,
} from "lucide-react";

type Booking = {
  id: string;
  reference: string;
  space: string;
  dateKey: string;
  startTime: string;
  endTime: string;
  packageLabel?: string;
  status: string;
};

type CheckinRecord = {
  id: string;
  checkedInAt: string | null;
  checkedOutAt: string | null;
  status: string;
  actualDurationMinutes: number | null;
};

type ValidationResult = {
  valid: boolean;
  error?: string;
  message?: string;
  booking?: Booking;
  activeCheckin?: CheckinRecord;
};

type CheckInClientProps = {
  venueSlug: string;
  venueName: string;
  userName: string;
};

export function CheckInClient({ venueSlug, venueName, userName }: CheckInClientProps) {
  const [loading, setLoading] = useState(true);
  const [validation, setValidation] = useState<ValidationResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<"idle" | "checking_in" | "checked_in" | "checked_out">("idle");
  const [timer, setTimer] = useState<number>(0);
  const [checkinTime, setCheckinTime] = useState<Date | null>(null);
  const [checkinId, setCheckinId] = useState<string | null>(null);
  const actionInProgressRef = useRef(false);

  // Validate booking on mount
  useEffect(() => {
    async function validateCheckin() {
      try {
        const response = await fetch(`/api/checkin/validate?venue=${venueSlug}`);
        const data: ValidationResult = await response.json();

        if (!data.valid) {
          setError(data.message || "Unable to check in.");
        } else {
          setValidation(data);

          // If there's an active check-in, restore the session
          if (data.activeCheckin && data.activeCheckin.status === "checked_in" && data.activeCheckin.checkedInAt) {
            setCheckinId(data.activeCheckin.id);
            setCheckinTime(new Date(data.activeCheckin.checkedInAt));
            setStatus("checked_in");
          }
        }
      } catch {
        setError("Failed to validate. Please try again.");
      } finally {
        setLoading(false);
      }
    }

    validateCheckin();
  }, [venueSlug]);

  // Live timer
  useEffect(() => {
    if (!checkinTime) return;

    const timerInterval = setInterval(() => {
      setTimer(Math.floor((Date.now() - checkinTime.getTime()) / 1000));
    }, 1000);

    return () => clearInterval(timerInterval);
  }, [checkinTime]);

  function formatTimer(seconds: number) {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  }

  const handleStartCheckIn = useCallback(async () => {
    if (!validation?.booking || actionInProgressRef.current) return;
    actionInProgressRef.current = true;

    setStatus("checking_in");
    try {
      const response = await fetch("/api/checkin/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bookingId: validation.booking.id,
          venueSlug,
        }),
      });
      const data = await response.json();

      if (data.success) {
        setCheckinId(data.checkinId);
        setCheckinTime(new Date(data.checkedInAt));
        setStatus("checked_in");
      } else {
        setError(data.message || "Failed to check in.");
        setStatus("idle");
      }
    } catch {
      setError("Network error. Please try again.");
      setStatus("idle");
    } finally {
      actionInProgressRef.current = false;
    }
  }, [validation, venueSlug]);

  const handleCheckOut = useCallback(async () => {
    if (!checkinId || actionInProgressRef.current) return;
    actionInProgressRef.current = true;

    try {
      const response = await fetch("/api/checkin/end", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ checkinId }),
      });
      const data = await response.json();

      if (data.success) {
        setStatus("checked_out");
        setCheckinTime(null);
      } else {
        setError(data.message || "Failed to check out.");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      actionInProgressRef.current = false;
    }
  }, [checkinId]);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <Loader2 className="w-12 h-12 text-white animate-spin mx-auto" />
            <div className="absolute inset-0 blur-xl bg-white/20 rounded-full" />
          </div>
          <p className="mt-4 text-white/60">Validating your booking...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    const isNoBooking = error.includes("No valid booking") || error.includes("book a slot");
    const isWrongTime = error.includes("not active");
    const isAlreadyCheckedIn = error.includes("active session");

    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-6">
        <div className="max-w-md text-center">
          <div
            className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 ${
              isAlreadyCheckedIn ? "bg-amber-500/20" : "bg-rose-500/20"
            }`}
          >
            <AlertCircle className={`w-10 h-10 ${isAlreadyCheckedIn ? "text-amber-400" : "text-rose-400"}`} />
          </div>
          <h1 className="text-2xl font-semibold text-white mb-3">
            {isNoBooking ? "No Booking Found" : isWrongTime ? "Not Your Time Slot" : isAlreadyCheckedIn ? "Already Checked In" : "Unable to Check In"}
          </h1>
          <p className="text-white/60 mb-8">{error}</p>
          <div className="space-y-3">
            {isNoBooking && (
              <Link
                href="/booking"
                className="block w-full bg-white text-black py-3.5 rounded-full font-semibold text-center transition-colors hover:bg-white/90"
              >
                Book a Slot
              </Link>
            )}
            <Link
              href="/dashboard"
              className="block w-full border border-white/20 text-white py-3.5 rounded-full font-semibold text-center transition-colors hover:bg-white/5"
            >
              Go to Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-6 pb-28">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center mx-auto mb-4 relative">
            <QrCode className="w-8 h-8 text-white" />
            {status === "checked_in" && (
              <div className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-green-500 rounded-full border-2 border-black animate-pulse" />
            )}
          </div>
          <h1 className="text-2xl font-semibold">Check-In</h1>
          <p className="text-white/60 mt-1">{venueName}</p>
        </div>

        {/* Welcome */}
        <div className="flex items-center gap-3 bg-[#111111] rounded-xl border border-white/10 px-4 py-3 mb-5">
          <User className="w-4 h-4 text-white shrink-0" />
          <span className="text-sm text-white/80">Welcome, {userName}</span>
        </div>

        {/* Booking details card */}
        {validation?.booking && (
          <div className="bg-[#111111] rounded-2xl border border-white/10 p-5 mb-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-[10px] uppercase tracking-widest text-white/50">Booking Details</span>
              <span className="text-xs text-white font-mono">{validation.booking.reference}</span>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <MapPin className="w-4 h-4 text-white/40 shrink-0" />
                <span className="text-sm">{venueName}</span>
              </div>
              <div className="flex items-center gap-3">
                <Calendar className="w-4 h-4 text-white/40 shrink-0" />
                <span className="text-sm">{validation.booking.dateKey}</span>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="w-4 h-4 text-white/40 shrink-0" />
                <span className="text-sm">
                  {validation.booking.startTime} – {validation.booking.endTime}
                </span>
              </div>
              {validation.booking.packageLabel && (
                <div className="flex items-center gap-3">
                  <Timer className="w-4 h-4 text-white/40 shrink-0" />
                  <span className="text-sm">{validation.booking.packageLabel}</span>
                </div>
              )}
            </div>

            <div className="mt-4 pt-3 border-t border-white/5">
              <span
                className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-widest ${
                  status === "checked_in"
                    ? "bg-green-500/10 text-green-400 border border-green-500/20"
                    : status === "checked_out"
                    ? "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                    : "bg-white/10 text-white border border-white/20"
                }`}
              >
                <div
                  className={`w-1.5 h-1.5 rounded-full ${
                    status === "checked_in"
                      ? "bg-green-400 animate-pulse"
                      : status === "checked_out"
                      ? "bg-blue-400"
                      : "bg-white"
                  }`}
                />
                {status === "checked_in"
                  ? "Checked In"
                  : status === "checked_out"
                  ? "Session Complete"
                  : "Ready to Check In"}
              </span>
            </div>
          </div>
        )}

        {/* Active session timer */}
        {status === "checked_in" && (
          <div className="bg-[#111111] rounded-2xl border border-white/20 p-6 mb-6 text-center">
            <p className="text-[10px] uppercase tracking-widest text-white mb-3">Active Session</p>
            <div className="text-5xl font-mono font-bold text-white tabular-nums">
              {formatTimer(timer)}
            </div>
            <p className="text-white/30 text-xs mt-2">Session timer</p>
          </div>
        )}

        {/* Checked out success */}
        {status === "checked_out" && (
          <div className="bg-green-500/5 rounded-2xl border border-green-500/20 p-6 mb-6 text-center">
            <CheckCircle className="w-14 h-14 text-green-400 mx-auto mb-3" />
            <p className="text-lg font-semibold text-green-400">Checked Out Successfully</p>
            <p className="text-white/50 mt-1 text-sm">Thank you for visiting {venueName}!</p>
          </div>
        )}

        {/* Action buttons */}
        {status === "idle" && validation?.valid && (
          <button
            onClick={handleStartCheckIn}
            className="w-full bg-white text-black py-4 rounded-full font-semibold text-lg hover:bg-white/90 transition-all active:scale-[0.98]"
          >
            Start Check-In
          </button>
        )}

        {status === "checking_in" && (
          <button disabled className="w-full bg-white/50 text-black py-4 rounded-full font-semibold text-lg flex items-center justify-center gap-2">
            <Loader2 className="w-5 h-5 animate-spin" />
            Starting...
          </button>
        )}

        {status === "checked_in" && (
          <button
            onClick={handleCheckOut}
            className="w-full bg-rose-500 text-white py-4 rounded-full font-semibold text-lg hover:bg-rose-600 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
          >
            <LogOut className="w-5 h-5" />
            Check-Out
          </button>
        )}

        {status === "checked_out" && (
          <Link
            href="/"
            className="block w-full bg-white text-black py-4 rounded-full font-semibold text-lg text-center hover:bg-white/90 transition-colors"
          >
            Go to Home
          </Link>
        )}
      </div>
    </div>
  );
}
