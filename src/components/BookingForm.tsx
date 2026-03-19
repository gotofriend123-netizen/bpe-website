"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

import { bookingFormSchema, BookingFormValues } from "@/lib/validations";
import { BOOKING_TYPES, SPECIFIC_STUDIOS, CONFIG } from "@/config/data";

export function BookingForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<BookingFormValues>({
    resolver: zodResolver(bookingFormSchema),
    defaultValues: {
      fullName: "",
      phoneNumber: "",
      email: "",
      bookingType: "",
      specificStudio: "",
      selectedPackage: "",
      date: "",
      time: "",
      termsAccepted: false,
    },
  });

  const selectedBookingType = watch("bookingType");

  const showSpecificStudio =
    selectedBookingType === "verve-studio-left" ||
    selectedBookingType === "verve-studio-right";

  const onSubmit = async (data: BookingFormValues) => {
    setIsSubmitting(true);
    
    // Fallback AbortController to FORCE loading spinner to stop if Vercel hangs
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 9000);

    try {
      // Ensure boolean typing and correct string shapes for API
      const payload = {
        ...data,
        termsAccepted: Boolean(data.termsAccepted),
        specificStudio: data.specificStudio || undefined,
        selectedPackage: data.selectedPackage || undefined,
      };

      const response = await fetch("/api/book", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        signal: controller.signal
      });
      clearTimeout(timeoutId);

      let responseData;
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.indexOf("application/json") !== -1) {
        responseData = await response.json();
      } else {
        const text = await response.text();
        console.error("Non-JSON Server Response:", text);
        throw new Error("Server returned an invalid response (Vercel timeout).");
      }

      if (!response.ok) {
        throw new Error(responseData?.message || "Failed to submit booking");
      }

      toast.success("Booking submitted successfully! We will contact you soon.");
      setIsSuccess(true);
      reset();
    } catch (error: unknown) {
      clearTimeout(timeoutId);
      console.error("Submission Error Response:", error);
      
      let errorMessage = "Something went wrong. Please try again.";
      if (error instanceof Error) {
        if (error.name === "AbortError") {
          errorMessage = "Booking timed out. The server is taking too long to respond. Please check your internet or try again later.";
        } else {
          errorMessage = error.message;
        }
      }
      
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const onError = (formErrors: unknown) => {
    console.error("Form Validation Errors:", formErrors);
    toast.error("Please correctly fill out all required fields.");
  };

  if (isSuccess) {
    return (
      <div className="bg-[#111] border border-white/10 rounded-2xl p-8 md:p-12 text-center space-y-6 shadow-2xl flex flex-col items-center justify-center min-h-[400px] animate-in fade-in zoom-in-95 duration-500">
        <div className="w-20 h-20 bg-green-500/20 text-green-400 rounded-full flex items-center justify-center mb-2">
          <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
          </svg>
        </div>
        <h3 className="text-3xl font-bold text-white tracking-tight">Booking Request Sent</h3>
        <p className="text-gray-400 text-lg max-w-sm mx-auto leading-relaxed">
          Thank you! Your booking request has been submitted successfully. Our team will contact you shortly.
        </p>
        <button
          onClick={() => setIsSuccess(false)}
          type="button"
          className="mt-8 px-8 py-3 bg-white text-black font-semibold rounded-xl hover:bg-gray-200 transition-colors"
        >
          Book Another Session
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit, onError)}
      className="bg-[#111] border border-white/10 rounded-2xl p-6 md:p-8 space-y-6 shadow-2xl relative overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent pointer-events-none" />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
        {/* Full Name */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-300">Full Name</label>
          <input
            {...register("fullName")}
            disabled={isSubmitting}
            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white/20 transition-all"
            placeholder="John Doe"
          />
          {errors.fullName && (
            <p className="text-red-400 text-xs mt-1">{errors.fullName.message}</p>
          )}
        </div>

        {/* Phone Number */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-300">Phone Number</label>
          <input
            {...register("phoneNumber")}
            disabled={isSubmitting}
            type="tel"
            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white/20 transition-all"
            placeholder="+91 XXXXX XXXXX"
          />
          {errors.phoneNumber && (
            <p className="text-red-400 text-xs mt-1">{errors.phoneNumber.message}</p>
          )}
        </div>

        {/* Email Address */}
        <div className="space-y-2 md:col-span-2">
          <label className="text-sm font-medium text-gray-300">Email Address</label>
          <input
            {...register("email")}
            disabled={isSubmitting}
            type="email"
            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white/20 transition-all"
            placeholder="johndoe@example.com"
          />
          {errors.email && (
            <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>
          )}
        </div>

        {/* Booking Type */}
        <div className="space-y-2 md:col-span-2">
          <label className="text-sm font-medium text-gray-300">Booking Type</label>
          <select
            {...register("bookingType")}
            disabled={isSubmitting}
            className="w-full bg-[#1a1a1a] border border-white/10 rounded-lg px-4 py-3 text-white appearance-none focus:outline-none focus:ring-2 focus:ring-white/20 transition-all cursor-pointer"
          >
            <option value="" disabled selected hidden>
              Select a Booking Type
            </option>
            {BOOKING_TYPES.map((type) => (
              <option key={type.id} value={type.id}>
                {type.label}
              </option>
            ))}
          </select>
          {errors.bookingType && (
            <p className="text-red-400 text-xs mt-1">{errors.bookingType.message}</p>
          )}
        </div>

        {/* Specific Studio - Conditional Render */}
        {showSpecificStudio && (

          <div className="space-y-2 md:col-span-2 animate-in fade-in slide-in-from-top-4 duration-300">
            <label className="text-sm font-medium text-gray-300">Specific Studio</label>
            <select
              {...register("specificStudio")}
              disabled={isSubmitting}
              className="w-full bg-[#1a1a1a] border border-white/10 rounded-lg px-4 py-3 text-white appearance-none focus:outline-none focus:ring-2 focus:ring-white/20 transition-all cursor-pointer"
            >
              <option value="" disabled selected hidden>
                Select a Specific Studio
              </option>
              {SPECIFIC_STUDIOS.map((studio) => (
                <optgroup key={studio.id} label={studio.name}>
                  <option value={studio.id} className="text-white/80">
                    {studio.name} — Please check package pricing below
                  </option>
                </optgroup>
              ))}
            </select>
            {errors.specificStudio && (
              <p className="text-red-400 text-xs mt-1">{errors.specificStudio.message}</p>
            )}

            {/* Pricing Packages based on Selected Specific Studio */}
            {watch("specificStudio") && (
              <div className="mt-4 p-4 rounded-xl bg-white/5 border border-white/10">
                <h4 className="text-sm font-semibold text-white mb-3">Select a Package:</h4>
                <div className="space-y-3">
                  {SPECIFIC_STUDIOS.find((s) => s.id === watch("specificStudio"))?.packages.map(
                    (pkg) => (
                      <label
                        key={pkg.id}
                        className="flex items-start space-x-3 p-3 rounded-lg border border-white/5 bg-[#1a1a1a] hover:bg-white/5 cursor-pointer transition-colors"
                      >
                        <input
                          type="radio"
                          value={pkg.id}
                          {...register("selectedPackage")}
                          disabled={isSubmitting}
                          className="mt-1 min-w-[16px] w-4 h-4 text-white focus:ring-white/20 bg-black border-gray-600 cursor-pointer"
                        />
                        <div className="flex flex-col sm:flex-row sm:justify-between w-full gap-1">
                          <span className="text-sm font-medium text-white">{pkg.name}</span>
                          <span className="text-sm text-gray-400">{pkg.pricePreview}</span>
                        </div>
                      </label>
                    )
                  )}
                </div>
                {errors.selectedPackage && (
                  <p className="text-red-400 text-xs mt-2">{errors.selectedPackage.message}</p>
                )}
              </div>
            )}
          </div>
        )}

        {/* Date Picker */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-300">Date</label>
          <input
            {...register("date")}
            disabled={isSubmitting}
            type="date"
            min={new Date().toISOString().split("T")[0]}
            className="w-full bg-[#1a1a1a] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-white/20 transition-all cursor-pointer"
            style={{ colorScheme: "dark" }}
          />
          {errors.date && (
            <p className="text-red-400 text-xs mt-1">{errors.date.message}</p>
          )}
        </div>

        {/* Time Picker */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-300">Time</label>
          <input
            {...register("time")}
            disabled={isSubmitting}
            type="time"
            className="w-full bg-[#1a1a1a] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-white/20 transition-all cursor-pointer"
            style={{ colorScheme: "dark" }}
          />
          {errors.time && (
            <p className="text-red-400 text-xs mt-1">{errors.time.message}</p>
          )}
        </div>
      </div>

      {/* Terms & Conditions */}
      <div className="flex items-start space-x-3 pt-4 relative z-10">
        <input
          {...register("termsAccepted")}
          disabled={isSubmitting}
          type="checkbox"
          id="terms"
          className="mt-1 w-5 h-5 rounded border-gray-600 bg-[#1a1a1a] text-white focus:ring-white/20 focus:ring-offset-0 cursor-pointer"
        />
        <div className="flex flex-col">
          <label htmlFor="terms" className="text-sm text-gray-300 cursor-pointer">
            I have read and agree to the{" "}
            <a
              href={CONFIG.termsAndConditionsLink}
              target="_blank"
              rel="noreferrer"
              className="text-white hover:underline font-medium"
            >
              Terms & Conditions
            </a>
          </label>
          {errors.termsAccepted && (
            <p className="text-red-400 text-xs mt-1">{errors.termsAccepted.message}</p>
          )}
        </div>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full py-4 px-6 rounded-xl bg-white text-black font-semibold text-lg hover:bg-gray-200 active:scale-[0.98] transition-all flex items-center justify-center space-x-2 disabled:opacity-70 disabled:cursor-not-allowed relative z-10"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>Submitting...</span>
          </>
        ) : (
          <span>Book Now</span>
        )}
      </button>
    </form>
  );
}
