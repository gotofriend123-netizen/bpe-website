"use client";

import { useEffect, useRef, useState } from "react";
import QRCode from "qrcode";
import {
  Download,
  Copy,
  Check,
  QrCode,
  MapPin,
  ExternalLink,
} from "lucide-react";

type VenueQRConfig = {
  slug: string;
  label: string;
  sublabel: string;
  path: string;
};

const VENUES: VenueQRConfig[] = [
  {
    slug: "arcade-main-gate",
    label: "Arcade Community Hall",
    sublabel: "Main Gate",
    path: "/check-in/arcade-main-gate",
  },
];

export function VenueQRManager() {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {VENUES.map((venue) => (
        <VenueQRCard key={venue.slug} venue={venue} />
      ))}
    </div>
  );
}

function VenueQRCard({ venue }: { venue: VenueQRConfig }) {
  const [qrDataUrl, setQrDataUrl] = useState<string>("");
  const [copied, setCopied] = useState(false);
  const [generating, setGenerating] = useState(true);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Construct the full URL — uses window origin at runtime
  const fullUrl = typeof window !== "undefined" ? `${window.location.origin}${venue.path}` : venue.path;

  useEffect(() => {
    async function generateQR() {
      setGenerating(true);
      try {
        const dataUrl = await QRCode.toDataURL(fullUrl, {
          width: 512,
          margin: 2,
          color: {
            dark: "#000000",
            light: "#ffffff",
          },
          errorCorrectionLevel: "H",
        });
        setQrDataUrl(dataUrl);
      } catch (err) {
        console.error("QR generation failed:", err);
      } finally {
        setGenerating(false);
      }
    }

    if (fullUrl.startsWith("http")) {
      generateQR();
    }
  }, [fullUrl]);

  const handleDownloadPNG = () => {
    if (!qrDataUrl) return;
    const link = document.createElement("a");
    link.download = `qr-${venue.slug}.png`;
    link.href = qrDataUrl;
    link.click();
  };

  const handleDownloadSVG = async () => {
    try {
      const svgString = await QRCode.toString(fullUrl, {
        type: "svg",
        width: 512,
        margin: 2,
        color: {
          dark: "#000000",
          light: "#ffffff",
        },
        errorCorrectionLevel: "H",
      });
      const blob = new Blob([svgString], { type: "image/svg+xml" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.download = `qr-${venue.slug}.svg`;
      link.href = url;
      link.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("SVG generation failed:", err);
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(fullUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for insecure contexts
      const textArea = document.createElement("textarea");
      textArea.value = fullUrl;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="rounded-[1.8rem] border border-white/6 bg-[#151515] p-6 shadow-[inset_8px_8px_16px_rgba(0,0,0,0.52),inset_-8px_-8px_16px_rgba(255,255,255,0.025)]">
      {/* Header */}
      <div className="flex items-start gap-3 mb-5">
        <div className="rounded-xl bg-white/10 p-2.5">
          <MapPin className="h-5 w-5 text-white" />
        </div>
        <div>
          <p className="text-base font-semibold text-white">{venue.label}</p>
          <p className="text-sm text-zinc-400 mt-0.5">{venue.sublabel}</p>
        </div>
      </div>

      {/* QR Preview */}
      <div className="flex justify-center mb-5">
        <div className="w-48 h-48 bg-white rounded-2xl flex items-center justify-center p-3 shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
          {generating ? (
            <div className="flex flex-col items-center gap-2">
              <QrCode className="w-12 h-12 text-gray-300 animate-pulse" />
              <span className="text-xs text-gray-400">Generating...</span>
            </div>
          ) : qrDataUrl ? (
            <img
              src={qrDataUrl}
              alt={`QR Code for ${venue.label}`}
              className="w-full h-full object-contain rounded-lg"
            />
          ) : (
            <QrCode className="w-16 h-16 text-gray-300" />
          )}
        </div>
      </div>

      {/* URL display */}
      <div className="rounded-xl border border-white/5 bg-black/25 px-3 py-2 mb-5">
        <p className="text-[10px] uppercase tracking-widest text-zinc-500 mb-1">Permanent Link</p>
        <p className="text-xs text-zinc-300 font-mono break-all">{fullUrl}</p>
      </div>

      {/* Actions */}
      <div className="grid grid-cols-2 gap-2">
        <button
          onClick={handleDownloadPNG}
          disabled={!qrDataUrl}
          className="flex items-center justify-center gap-1.5 rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2.5 text-[11px] font-semibold uppercase tracking-widest text-white transition-all hover:bg-white/[0.08] disabled:opacity-40"
        >
          <Download className="h-3.5 w-3.5" />
          PNG
        </button>
        <button
          onClick={handleDownloadSVG}
          disabled={generating}
          className="flex items-center justify-center gap-1.5 rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2.5 text-[11px] font-semibold uppercase tracking-widest text-white transition-all hover:bg-white/[0.08] disabled:opacity-40"
        >
          <Download className="h-3.5 w-3.5" />
          SVG
        </button>
        <button
          onClick={handleCopyLink}
          className="flex items-center justify-center gap-1.5 rounded-xl border border-white/20 bg-white/10 px-3 py-2.5 text-[11px] font-semibold uppercase tracking-widest text-white transition-all hover:bg-white/20 col-span-2"
        >
          {copied ? (
            <>
              <Check className="h-3.5 w-3.5" />
              Copied!
            </>
          ) : (
            <>
              <Copy className="h-3.5 w-3.5" />
              Copy Link
            </>
          )}
        </button>
      </div>

      {/* Print hint */}
      <p className="text-[10px] text-zinc-600 text-center mt-4 flex items-center justify-center gap-1">
        <ExternalLink className="h-3 w-3" />
        Print this QR and display at the venue gate
      </p>

      {/* Hidden canvas for QR generation */}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}
