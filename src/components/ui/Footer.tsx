"use client";

import Link from "next/link";
import Image from "next/image";
import {
  CalendarCheck2,
  Camera,
  Car,
  CreditCard,
  HardDriveUpload,
  MoveRight,
} from "lucide-react";

import {
  Component as FooterFaqAccordion,
  type AccordianItem,
} from "@/components/ui/accordian";
import { DemoTestimonials } from "@/components/ui/demo-testimonials";

const footerFaqItems: AccordianItem[] = [
  {
    id: "1",
    icon: CalendarCheck2,
    title: "How do I book a space?",
    content:
      "Book directly through our reservation flow, choose your space, select your date and time, and submit your request online.",
  },
  {
    id: "2",
    icon: CreditCard,
    title: "Is payment required in advance?",
    content:
      "Yes. Payment or the allowed advance amount is required to secure your slot and confirm the equipment or crew needs for your session.",
  },
  {
    id: "3",
    icon: Camera,
    title: "Can I bring my own gear or crew?",
    content:
      "Absolutely. You can bring your own directors, DPs, or specialized equipment alongside the production support we already provide.",
  },
  {
    id: "4",
    icon: HardDriveUpload,
    title: "Will I receive raw footage immediately?",
    content:
      "Yes. Bring a fast SSD or SD card and you can leave the studio with your raw 4K video files and multitrack audio right after the session.",
  },
  {
    id: "5",
    icon: Car,
    title: "Do you provide parking?",
    content:
      "We have designated parking on a first-come, first-served basis, plus safe nearby street parking for overflow.",
  },
];

export function Footer() {
  return (
    <footer className="bg-[#050505] border-t border-white/10 pt-24 pb-12 relative overflow-hidden">
      <div className="absolute top-0 inset-x-0 h-px w-full bg-gradient-to-r from-transparent via-white/20 to-transparent" />
      
      <div className="container mx-auto px-4 md:px-12 relative z-10">
        <div className="mb-20 grid grid-cols-1 gap-10 rounded-[2rem] border border-white/10 bg-white/[0.02] p-6 sm:p-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <div className="max-w-xl space-y-5">
            <span className="inline-flex rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-gray-300">
              Need answers fast?
            </span>
            <div className="space-y-4">
              <h3 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                Quick FAQs before you book.
              </h3>
              <p className="max-w-lg text-sm leading-relaxed text-gray-400 sm:text-base">
                The most common questions now live right in the footer, so guests can check logistics, payments, and studio details without leaving the page.
              </p>
            </div>
            <Link
              href="/faq"
              className="inline-flex items-center gap-2 text-sm font-medium text-white transition-colors hover:text-gray-300"
            >
              View full FAQ page <MoveRight className="h-4 w-4" />
            </Link>
          </div>

          <FooterFaqAccordion
            title="Frequently asked questions"
            items={footerFaqItems}
            className="max-w-none"
          />
        </div>

        <div className="mb-20">
          <DemoTestimonials />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-16">
          
          <div className="space-y-6 lg:col-span-1">
            <Link href="/" className="flex items-center gap-2">
              <Image 
                src="/BLACK PEPPER LOGO  WIGHT PNG.png" 
                alt="Black Pepper Entertainment Logo" 
                width={400} 
                height={160} 
                className="h-20 w-auto sm:h-24 object-contain opacity-90 transition-opacity hover:opacity-100" 
              />
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed max-w-xs">
              Where people gather, create, and speak. The ultimate destination for events, podcasters, and creators.
            </p>
          </div>

          <div className="space-y-6">
            <h4 className="text-white font-semibold">Spaces</h4>
            <ul className="space-y-4">
              <li>
                <Link href="/the-arcade" className="text-gray-400 hover:text-white transition-colors text-sm">
                  The Arcade (Community Hall)
                </Link>
              </li>
              <li>
                <Link href="/verve-studio" className="text-gray-400 hover:text-white transition-colors text-sm">
                  Verve Studio (Podcast)
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="text-gray-400 hover:text-white transition-colors text-sm">
                  Pricing & Packages
                </Link>
              </li>
              <li>
                <Link href="/gallery" className="text-gray-400 hover:text-white transition-colors text-sm">
                  Gallery Showcase
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-6">
            <h4 className="text-white font-semibold">Company</h4>
            <ul className="space-y-4">
              <li>
                <Link href="/about" className="text-gray-400 hover:text-white transition-colors text-sm">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/blogs" className="text-gray-400 hover:text-white transition-colors text-sm">
                  Journal / Blog
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-gray-400 hover:text-white transition-colors text-sm">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-400 hover:text-white transition-colors text-sm">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-6">
            <h4 className="text-white font-semibold">Ready to create?</h4>
            <p className="text-gray-400 text-sm">
              Secure your spot instantly and elevate your next project or event.
            </p>
            <Link 
              href="/calendar"
              className="inline-flex items-center gap-2 bg-white/10 hover:bg-white hover:text-black text-white px-6 py-3 rounded-xl text-sm font-semibold transition-all border border-white/10"
            >
              Book Now <MoveRight className="w-4 h-4" />
            </Link>
          </div>

        </div>

        <div className="mt-20 pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-gray-500 text-sm text-center md:text-left">
            © {new Date().getFullYear()} Black Pepper Entertainment. All rights reserved.
          </p>
          <div className="flex gap-6">
            <Link href="/legal/terms" className="text-gray-500 hover:text-gray-300 text-xs transition-colors">
              Terms & Conditions
            </Link>
            <Link href="/legal/cancellation" className="text-gray-500 hover:text-gray-300 text-xs transition-colors">
              Cancellation Policy
            </Link>
            <Link href="/legal/privacy" className="text-gray-500 hover:text-gray-300 text-xs transition-colors">
              Privacy Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
