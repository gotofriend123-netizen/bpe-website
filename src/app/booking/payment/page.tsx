"use client";

import { AnimatedSection } from "@/components/ui/AnimatedSection";
import { CreditCard, CheckCircle2, ShieldCheck, MoveRight, Loader2 } from "lucide-react";
import { useState } from "react";
import Link from "next/link";

export default function PaymentPage() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSimulatePayment = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
    }, 2500);
  }

  if (success) {
    return (
      <div className="bg-black min-h-screen pt-40 pb-24 px-6 flex flex-col items-center justify-center text-center">
        <AnimatedSection className="max-w-md w-full">
          <div className="w-24 h-24 bg-[#25D366]/20 text-[#25D366] rounded-full flex items-center justify-center mx-auto mb-8 shadow-[0_0_50px_rgba(37,211,102,0.3)]">
            <CheckCircle2 className="w-12 h-12" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">Payment Successful</h1>
          <p className="text-lg text-gray-400 mb-8 leading-relaxed">
            Your booking at Black Pepper Entertainment is confirmed. A receipt and calendar invite has been sent to your email.
          </p>
          <div className="space-y-4">
            <Link href="/booking/manage" className="block w-full py-4 bg-white text-black font-bold rounded-xl hover:bg-gray-200 transition-colors">
              Manage Booking
            </Link>
            <Link href="/" className="block w-full py-4 bg-transparent border border-white/20 text-white font-bold rounded-xl hover:bg-white/5 transition-colors">
              Return Home
            </Link>
          </div>
        </AnimatedSection>
      </div>
    );
  }

  return (
    <div className="bg-black min-h-screen pt-32 pb-24">
      <div className="container mx-auto px-6 max-w-5xl">
        <AnimatedSection className="mb-12">
          <h1 className="text-4xl font-bold mb-4 text-white">Complete Payment</h1>
          <p className="text-gray-400">Secure your slot by completing the payment below.</p>
        </AnimatedSection>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Order Summary */}
          <AnimatedSection direction="right" className="bg-[#111] border border-white/10 rounded-3xl p-8">
            <h3 className="text-xl font-bold text-white mb-6 border-b border-white/10 pb-4">Order Summary</h3>
            <div className="space-y-4 mb-8">
              <div className="flex justify-between items-center text-white">
                <span className="font-semibold">The Arcade (Full Day)</span>
                <span>₹25,000</span>
              </div>
              <div className="flex justify-between items-center text-gray-400 text-sm">
                <span>Date</span>
                <span>March 22, 2026</span>
              </div>
              <div className="flex justify-between items-center text-gray-400 text-sm">
                <span>Time</span>
                <span>09:00 AM - 05:00 PM</span>
              </div>
            </div>
            
            <div className="pt-6 border-t border-white/10">
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-400">Subtotal</span>
                <span className="text-white">₹25,000</span>
              </div>
              <div className="flex justify-between items-center mb-6">
                <span className="text-gray-400">GST (18%)</span>
                <span className="text-white">₹4,500</span>
              </div>
              <div className="flex justify-between items-end">
                <div>
                  <span className="text-sm font-bold uppercase tracking-widest text-white">Total Due</span>
                </div>
                <span className="text-4xl font-bold text-white">₹29,500</span>
              </div>
            </div>
          </AnimatedSection>

          {/* Payment Element */}
          <AnimatedSection direction="left" className="space-y-6">
            <div className="bg-[#111] border border-white/10 rounded-3xl p-8 relative overflow-hidden">
               <div className="flex items-center gap-2 mb-8 border-b border-white/10 pb-4">
                 <ShieldCheck className="w-5 h-5 text-green-500" />
                 <span className="text-sm text-gray-300 font-semibold tracking-wide">SECURE SSL PAYMENT</span>
               </div>

               {/* Mock Payment Form */}
               <div className="space-y-4 mb-8">
                 <div>
                   <label className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-2 block">Card Number</label>
                   <div className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white flex items-center justify-between">
                     <span className="text-gray-400 tracking-widest">**** **** **** 4242</span>
                     <CreditCard className="w-5 h-5 text-gray-500" />
                   </div>
                 </div>
                 <div className="grid grid-cols-2 gap-4">
                   <div>
                     <label className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-2 block">Expiry</label>
                     <div className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white">
                       <span className="text-gray-400 tracking-widest">12 / 28</span>
                     </div>
                   </div>
                   <div>
                     <label className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-2 block">CVC</label>
                     <div className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white">
                       <span className="text-gray-400 tracking-widest">***</span>
                     </div>
                   </div>
                 </div>
               </div>

               <button 
                 onClick={handleSimulatePayment}
                 disabled={loading}
                 className="w-full py-4 bg-white text-black font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-gray-200 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
               >
                 {loading ? (
                   <><Loader2 className="w-5 h-5 animate-spin" /> Processing...</>
                 ) : (
                   <>Pay ₹29,500 <MoveRight className="w-5 h-5" /></>
                 )}
               </button>
            </div>
            
            <p className="text-xs text-gray-500 text-center leading-relaxed">
              Payments are processed securely via Stripe. We do not store any of your credit card details. By paying, you agree to our Cancellation Policy.
            </p>
          </AnimatedSection>
        </div>
      </div>
    </div>
  );
}
