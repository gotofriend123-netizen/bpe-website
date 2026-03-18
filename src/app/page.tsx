import { BookingForm } from "@/components/BookingForm";
import { MoveRight, Star } from "lucide-react";

export const metadata = {
  title: "Book Verve Studio | Premium Content Creation Space",
  description: "Secure your next creative session at Verve Studio. Professional podcast setups, photo, and video shoots.",
};

export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white selection:bg-white/30 font-sans">
      {/* Background gradients */}
      <div className="fixed inset-0 pointer-events-none z-0 flex items-center justify-center overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-purple-900/20 blur-[120px] rounded-full mix-blend-screen" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-900/20 blur-[120px] rounded-full mix-blend-screen" />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-12 md:py-24 max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-start">
          
          {/* Left Column: Details & Hero */}
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
            <div className="inline-flex items-center space-x-2 bg-white/5 border border-white/10 rounded-full px-4 py-1.5 text-sm font-medium text-gray-300">
              <Star className="w-4 h-4 text-yellow-500" />
              <span>Premium Production Spaces</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-br from-white to-gray-500 leading-tight">
              Create Your Best Work.
            </h1>
            
            <p className="text-lg md:text-xl text-gray-400 max-w-lg leading-relaxed">
              Book the perfect studio for your next podcast, photoshoot, or video production. Equipment, lighting, and an unmatched aesthetic included.
            </p>

            <div className="pt-8 space-y-4">
              <div className="flex items-center space-x-4 text-gray-300">
                <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                  <MoveRight className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-white">Instant Confirmation</h3>
                  <p className="text-sm">Secure your slot instantly via email.</p>
                </div>
              </div>
              <div className="flex items-center space-x-4 text-gray-300">
                <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                  <MoveRight className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-white">Fully Customizable</h3>
                  <p className="text-sm">Add equipment edits & crew as needed.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: The Form */}
          <div className="lg:mt-4 animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-200">
            <BookingForm />
          </div>

        </div>
      </div>
    </main>
  );
}
