"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { Camera, Loader2, AlertTriangle, RotateCcw } from "lucide-react";

type QRScannerProps = {
  onScan: (data: string) => void;
  onError?: (error: string) => void;
};

export function QRScanner({ onScan, onError }: QRScannerProps) {
  const [status, setStatus] = useState<"loading" | "scanning" | "error">("loading");
  const [errorMsg, setErrorMsg] = useState<string>("");
  const scannerRef = useRef<import("html5-qrcode").Html5Qrcode | null>(null);
  const scanLockRef = useRef(false);
  const mountedRef = useRef(true);
  const initAttemptedRef = useRef(false);

  const stopCamera = useCallback(async () => {
    if (scannerRef.current) {
      try {
        const state = scannerRef.current.getState();
        // Only stop if scanning or paused (states 2, 3)
        if (state === 2 || state === 3) {
          await scannerRef.current.stop();
        }
      } catch {
        // Ignore stop errors
      }
      try {
        scannerRef.current.clear();
      } catch {
        // Ignore clear errors
      }
      scannerRef.current = null;
    }
  }, []);

  const startCamera = useCallback(async () => {
    if (!mountedRef.current) return;

    setStatus("loading");
    setErrorMsg("");
    scanLockRef.current = false;

    // Ensure previous instance is cleaned up
    await stopCamera();

    // Small delay to let the DOM render the reader div
    await new Promise((r) => setTimeout(r, 300));

    if (!mountedRef.current) return;

    const readerEl = document.getElementById("qr-reader-viewport");
    if (!readerEl) {
      setStatus("error");
      setErrorMsg("Scanner element not found. Please reload.");
      return;
    }

    try {
      const { Html5Qrcode } = await import("html5-qrcode");
      if (!mountedRef.current) return;

      scannerRef.current = new Html5Qrcode("qr-reader-viewport");

      await scannerRef.current.start(
        { facingMode: "environment" },
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
          aspectRatio: 1,
        },
        (decodedText) => {
          if (scanLockRef.current) return;
          scanLockRef.current = true;
          onScan(decodedText);
        },
        () => {
          // Ignore scan failures (expected while searching for QR)
        }
      );

      if (mountedRef.current) {
        setStatus("scanning");
      }
    } catch (err) {
      if (!mountedRef.current) return;
      const message =
        err instanceof Error
          ? err.message.includes("NotAllowedError") || err.message.includes("Permission")
            ? "Camera permission was denied. Please allow camera access in your browser settings."
            : err.message.includes("NotFoundError")
            ? "No camera found on this device."
            : `Camera error: ${err.message}`
          : "Unable to access camera. Please grant camera permission.";

      setStatus("error");
      setErrorMsg(message);
      onError?.(message);
    }
  }, [onScan, onError, stopCamera]);

  useEffect(() => {
    mountedRef.current = true;
    
    if (!initAttemptedRef.current) {
      initAttemptedRef.current = true;
      startCamera();
    }

    return () => {
      mountedRef.current = false;
      stopCamera();
    };
  }, [startCamera, stopCamera]);

  return (
    <div className="fixed inset-0 z-50 bg-black flex flex-col">
      {/* Header */}
      <div className="p-4 flex items-center justify-center border-b border-white/10">
        <h2 className="text-lg font-semibold text-white">Scan QR Code</h2>
      </div>

      {/* Scanner area */}
      <div className="flex-1 relative flex items-center justify-center overflow-hidden">
        {status === "loading" && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-black">
            <div className="relative">
              <Loader2 className="w-12 h-12 text-[#d8f24d] animate-spin" />
              <div className="absolute inset-0 blur-xl bg-[#d8f24d]/20 rounded-full" />
            </div>
            <p className="text-white/60 mt-4 text-sm">Starting camera...</p>
            <p className="text-white/30 mt-1 text-xs">Allow camera access if prompted</p>
          </div>
        )}

        {/* QR Reader viewport - always rendered so Html5Qrcode can attach */}
        <div
          id="qr-reader-viewport"
          className={`w-full max-w-sm mx-auto ${status === "error" ? "hidden" : ""}`}
        />

        {/* Scanning overlay */}
        {status === "scanning" && (
          <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
            <div className="relative w-64 h-64">
              {/* Corner accents */}
              <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-[#d8f24d] rounded-tl-lg" />
              <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-[#d8f24d] rounded-tr-lg" />
              <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-[#d8f24d] rounded-bl-lg" />
              <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-[#d8f24d] rounded-br-lg" />
              
              {/* Scanning line animation */}
              <div className="absolute left-2 right-2 h-0.5 bg-gradient-to-r from-transparent via-[#d8f24d] to-transparent animate-[scanLine_2s_ease-in-out_infinite]" />
            </div>
          </div>
        )}

        {status === "error" && (
          <div className="text-center p-6 max-w-sm">
            <div className="w-20 h-20 rounded-full bg-rose-500/10 flex items-center justify-center mx-auto mb-5">
              <AlertTriangle className="w-10 h-10 text-rose-400" />
            </div>
            <p className="text-white/80 text-base font-medium mb-2">Camera Access Failed</p>
            <p className="text-white/50 text-sm mb-6">{errorMsg}</p>
            <button
              onClick={() => {
                initAttemptedRef.current = false;
                startCamera();
              }}
              className="inline-flex items-center gap-2 bg-[#d8f24d] text-black px-6 py-3 rounded-full font-semibold transition-all hover:bg-[#c4d244] active:scale-95"
            >
              <RotateCcw className="w-4 h-4" />
              Try Again
            </button>
          </div>
        )}
      </div>

      {/* Bottom hint */}
      <div className="p-4 border-t border-white/10">
        <p className="text-xs text-white/40 text-center flex items-center justify-center gap-2">
          <Camera className="w-3.5 h-3.5" />
          Point your camera at the venue QR code
        </p>
      </div>

      {/* Scan line animation keyframes */}
      <style jsx>{`
        @keyframes scanLine {
          0%, 100% { top: 8px; }
          50% { top: calc(100% - 8px); }
        }
      `}</style>
    </div>
  );
}
