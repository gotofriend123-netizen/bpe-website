import { AnimatedSection } from "@/components/ui/AnimatedSection";
import { Mail, Phone, MapPin, MessageCircle } from "lucide-react";

export const metadata = {
  title: "Contact Black Pepper Entertainment Raipur | Enquire About Bookings",
  description: "Contact Black Pepper Entertainment in Raipur, Chhattisgarh. Call, email, or WhatsApp to enquire about booking The Arcade event hall or Verve Studio podcast recording studio.",
  keywords: [
    "contact Black Pepper Entertainment Raipur",
    "event hall enquiry Raipur",
    "podcast studio contact Raipur",
    "book arcade Raipur contact",
    "Verve Studio contact",
    "Black Pepper Entertainment phone number",
    "Black Pepper Entertainment address Raipur",
  ],
};

export default function ContactPage() {
  return (
    <div className="bg-black min-h-screen pt-32 pb-24">
      <div className="container mx-auto px-6 max-w-6xl">
        
        <AnimatedSection className="text-center mb-20">
          <span className="inline-flex rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.3em] text-zinc-300 mb-4">Raipur, Chhattisgarh</span>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 text-white">Contact Us</h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Got specific requirements for a large event? Want to visit before booking? Or just want a quick quote? Reach out — we respond fast.
          </p>
        </AnimatedSection>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
          <AnimatedSection direction="right" className="space-y-8">
            <h2 className="text-3xl font-bold text-white mb-6">Direct Lines</h2>
            
            <div className="flex items-center gap-6 bg-white/5 border border-white/10 p-6 rounded-2xl">
              <Phone className="w-8 h-8 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500 mb-1">Call Us</p>
                <p className="text-xl font-bold text-white">+91 92034 11611</p>
              </div>
            </div>

            <div className="flex items-center gap-6 bg-white/5 border border-white/10 p-6 rounded-2xl">
              <Mail className="w-8 h-8 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500 mb-1">Email Us</p>
                <p className="text-xl font-bold text-white">blackpepperentertainment.in@gmail.com</p>
              </div>
            </div>

            <div className="flex items-center gap-6 bg-[#25D366]/10 border border-[#25D366]/20 p-6 rounded-2xl text-[#25D366]">
              <MessageCircle className="w-8 h-8" />
              <div>
                <p className="text-sm opacity-80 mb-1">WhatsApp Chat</p>
                <a href="https://wa.me/919203411611" target="_blank" rel="noopener noreferrer" className="text-xl font-bold hover:underline">Message Us Instantly</a>
              </div>
            </div>
          </AnimatedSection>

          <AnimatedSection direction="left" className="h-full">
            <div className="bg-[#111] border border-white/10 rounded-3xl p-8 md:p-10 h-full flex flex-col justify-center">
              <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-6">
                <MapPin className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-white mb-4">Find Us in Raipur</h2>
              <p className="text-gray-400 text-lg leading-relaxed mb-6">
                The Arcade &amp; Verve Studio, <br />
                Near Hotel Royal Avenue, <br />
                Raipur, Chhattisgarh 492001
              </p>
              
              <a
                href="https://maps.google.com/?q=Black+Pepper+Entertainment,+Near+Hotel+Royal+Avenue,+Raipur+Chhattisgarh"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 py-3 px-6 bg-white/10 border border-white/20 rounded-xl text-white text-sm font-semibold hover:bg-white hover:text-black transition-all"
              >
                <MapPin className="w-4 h-4" /> Open in Google Maps
              </a>

              <div className="mt-6 pt-6 border-t border-white/10">
                <p className="text-xs text-gray-600 uppercase tracking-widest mb-2">Hours</p>
                <p className="text-gray-300 font-semibold">Mon – Sun: 9:00 AM – 9:00 PM</p>
              </div>
            </div>
          </AnimatedSection>
        </div>

      </div>
    </div>
  );
}
