import { AnimatedSection } from "@/components/ui/AnimatedSection";
import { Mail, Phone, MapPin, MessageCircle } from "lucide-react";

export const metadata = {
  title: "Contact Us | Black Pepper Entertainment",
  description: "Get in touch with the Black Pepper Entertainment team.",
};

export default function ContactPage() {
  return (
    <div className="bg-black min-h-screen pt-32 pb-24">
      <div className="container mx-auto px-6 max-w-6xl">
        
        <AnimatedSection className="text-center mb-20">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 text-white">Contact Us</h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Got specific requirements for a huge event? Or just want to check out the studio before booking? Reach out.
          </p>
        </AnimatedSection>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
          <AnimatedSection direction="right" className="space-y-8">
            <h2 className="text-3xl font-bold text-white mb-6">Direct Lines</h2>
            
            <div className="flex items-center gap-6 bg-white/5 border border-white/10 p-6 rounded-2xl">
              <Phone className="w-8 h-8 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500 mb-1">Call Us</p>
                <p className="text-xl font-bold text-white">+91 98765 43210</p>
              </div>
            </div>

            <div className="flex items-center gap-6 bg-white/5 border border-white/10 p-6 rounded-2xl">
              <Mail className="w-8 h-8 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500 mb-1">Email Us</p>
                <p className="text-xl font-bold text-white">hello@blackpepper.ent</p>
              </div>
            </div>

            <div className="flex items-center gap-6 bg-[#25D366]/10 border border-[#25D366]/20 p-6 rounded-2xl text-[#25D366]">
              <MessageCircle className="w-8 h-8" />
              <div>
                <p className="text-sm opacity-80 mb-1">WhatsApp Chat</p>
                <a href="#" className="text-xl font-bold hover:underline">Message Us Instantly</a>
              </div>
            </div>
          </AnimatedSection>

          <AnimatedSection direction="left" className="h-full">
            <div className="bg-[#111] border border-white/10 rounded-3xl p-8 md:p-10 h-full flex flex-col justify-center">
              <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-6">
                <MapPin className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-white mb-4">Location</h2>
              <p className="text-gray-400 text-lg leading-relaxed mb-6">
                123 Creative Avenue, <br />
                Innovation District, Phase 4 <br />
                Mumbai, Maharashtra 400001
              </p>
              
              <div className="w-full h-48 bg-white/5 border border-white/10 rounded-2xl overflow-hidden relative">
                <div className="absolute inset-0 flex items-center justify-center text-gray-500">
                  <span className="text-sm uppercase tracking-widest font-semibold">Interactive Map Placeholder</span>
                </div>
              </div>
            </div>
          </AnimatedSection>
        </div>

      </div>
    </div>
  );
}
