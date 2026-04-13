"use client";

import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import { QRScanner } from "@/components/ui/QRScanner";
import { AlertTriangle } from "lucide-react";
import Link from "next/link";

export default function ScanQRPage() {
  const router = useRouter();
  const [invalidQR, setInvalidQR] = useState(false);

  const handleScan = useCallback(
    (decodedText: string) => {
      setInvalidQR(false);

      // The QR code should contain a full URL or a relative path
      // Extract the path from the decoded text
      let targetPath: string | null = null;

      try {
        // If it's a full URL, extract the pathname
        const url = new URL(decodedText);
        targetPath = url.pathname;
      } catch {
        // If it's already a relative path starting with /
        if (decodedText.startsWith("/")) {
          targetPath = decodedText;
        }
      }

      // Validate it's a check-in route
      if (targetPath && targetPath.startsWith("/check-in/")) {
        router.push(targetPath);
      } else {
        setInvalidQR(true);
      }
    },
    [router]
  );

  if (invalidQR) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-6">
        <div className="max-w-md text-center">
          <div className="w-20 h-20 rounded-full bg-rose-500/20 flex items-center justify-center mx-auto mb-6">
            <AlertTriangle className="w-10 h-10 text-rose-400" />
          </div>
          <h1 className="text-2xl font-semibold text-white mb-3">Invalid QR Code</h1>
          <p className="text-white/60 mb-8">
            This QR code is not a valid venue check-in code. Please scan the QR code displayed at the venue entrance.
          </p>
          <div className="space-y-3">
            <button
              onClick={() => setInvalidQR(false)}
              className="block w-full bg-[#d8f24d] text-black py-3.5 rounded-full font-semibold text-center transition-colors hover:bg-[#c4d244]"
            >
              Scan Again
            </button>
            <Link
              href="/"
              className="block w-full border border-white/20 text-white py-3.5 rounded-full font-semibold text-center transition-colors hover:bg-white/5"
            >
              Go Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return <QRScanner onScan={handleScan} />;
}
