import type { Metadata } from "next";
import { Suspense } from "react";
import localFont from "next/font/local";
import { Toaster } from "sonner";
import { Navbar } from "@/components/ui/Navbar";
import { Footer } from "@/components/ui/Footer";
import { FloatingActions } from "@/components/ui/FloatingActions";
import { AuthEntryPrompt } from "@/components/auth/AuthEntryPrompt";
import { getCurrentUserSummary } from "@/lib/auth/session";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Black Pepper Entertainment",
  description: "Where People Gather, Create, and Speak. The Arcade community hall and Verve Studio podcast spaces.",
};

export const dynamic = "force-dynamic";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const currentUser = await getCurrentUserSummary();

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-black text-white`}
      >
        <Navbar currentUser={currentUser} />
        <Suspense fallback={null}>
          <AuthEntryPrompt currentUser={currentUser} />
        </Suspense>
        <main className="min-h-screen">
          {children}
        </main>
        <Footer />
        <FloatingActions />
        <Toaster theme="dark" position="bottom-right" />
      </body>
    </html>
  );
}
