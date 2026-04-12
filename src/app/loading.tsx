import { Loader2 } from "lucide-react";

function LoadingScreen() {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-[#d8f24d]" />
        <p className="text-sm text-white/60">Loading...</p>
      </div>
    </div>
  );
}

export default function Loading() {
  return <LoadingScreen />;
}