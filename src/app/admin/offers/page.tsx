import { format, parseISO } from "date-fns";
import Link from "next/link";
import type { InputHTMLAttributes, ReactNode, TextareaHTMLAttributes } from "react";
import { ArrowRight, BadgePercent, CalendarClock, Gift, Sparkles } from "lucide-react";

import { createOfferAction } from "@/app/admin/actions";
import { getAdminOffers } from "@/lib/admin/control-center";

function FieldLabel({ children }: { children: ReactNode }) {
  return (
    <label className="block text-[11px] font-semibold uppercase tracking-[0.24em] text-zinc-500">
      {children}
    </label>
  );
}

function Input({ className = "", ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={`mt-2 min-h-[48px] w-full rounded-[1rem] border border-white/10 bg-black/25 px-4 text-sm text-white outline-none transition-all duration-200 placeholder:text-zinc-500 focus:border-[#d8f24d]/35 focus:bg-white/[0.03] ${className}`}
    />
  );
}

function Textarea({ className = "", ...props }: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      className={`mt-2 w-full rounded-[1rem] border border-white/10 bg-black/25 px-4 py-3 text-sm leading-7 text-white outline-none transition-all duration-200 placeholder:text-zinc-500 focus:border-[#d8f24d]/35 focus:bg-white/[0.03] ${className}`}
    />
  );
}

function Checkbox({
  name,
  label,
  defaultChecked = false,
}: {
  name: string;
  label: string;
  defaultChecked?: boolean;
}) {
  return (
    <label className="flex items-center gap-3 rounded-[1rem] border border-white/8 bg-black/25 px-4 py-3 text-sm text-white">
      <input
        type="checkbox"
        name={name}
        defaultChecked={defaultChecked}
        className="h-4 w-4 rounded border-white/20 bg-black text-[#d8f24d] focus:ring-[#d8f24d]/30"
      />
      {label}
    </label>
  );
}

type AdminOffersPageProps = {
  searchParams?: {
    success?: string;
    error?: string;
  };
};

export default async function AdminOffersPage({ searchParams }: AdminOffersPageProps) {
  const offers = await getAdminOffers();
  const activeCount = offers.filter((offer) => offer.status === "active").length;
  const featuredCount = offers.filter((offer) => offer.featured).length;

  return (
    <div className="space-y-6">
      {searchParams?.success ? (
        <div className="rounded-[1.6rem] border border-emerald-400/15 bg-emerald-500/10 px-5 py-4 text-sm text-emerald-200">
          Offer published successfully for <span className="font-semibold text-white">{searchParams.success}</span>.
        </div>
      ) : null}
      {searchParams?.error ? (
        <div className="rounded-[1.6rem] border border-rose-400/15 bg-rose-500/10 px-5 py-4 text-sm text-rose-200">
          {searchParams.error}
        </div>
      ) : null}

      <section className="grid gap-4 md:grid-cols-3">
        <div className="rounded-[1.6rem] border border-white/10 bg-[linear-gradient(180deg,rgba(34,34,34,0.96),rgba(16,16,16,0.94))] p-5">
          <p className="text-[11px] font-semibold uppercase tracking-[0.26em] text-zinc-500">Live offers</p>
          <p className="mt-3 text-4xl font-semibold text-white">{activeCount}</p>
          <p className="mt-2 text-sm text-zinc-400">Active offer surfaces currently available for campaigns and conversion pushes.</p>
        </div>
        <div className="rounded-[1.6rem] border border-white/10 bg-[linear-gradient(180deg,rgba(34,34,34,0.96),rgba(16,16,16,0.94))] p-5">
          <p className="text-[11px] font-semibold uppercase tracking-[0.26em] text-zinc-500">Featured</p>
          <p className="mt-3 text-4xl font-semibold text-white">{featuredCount}</p>
          <p className="mt-2 text-sm text-zinc-400">Offers highlighted for the strongest discoverability and direct campaign support.</p>
        </div>
        <div className="rounded-[1.6rem] border border-white/10 bg-[linear-gradient(180deg,rgba(34,34,34,0.96),rgba(16,16,16,0.94))] p-5">
          <p className="text-[11px] font-semibold uppercase tracking-[0.26em] text-zinc-500">Admin control</p>
          <p className="mt-3 text-4xl font-semibold text-white">100%</p>
          <p className="mt-2 text-sm text-zinc-400">Offer creation, expiry, and campaign messaging remain protected behind admin-only access.</p>
        </div>
      </section>

      <section className="grid gap-4 xl:grid-cols-[0.9fr_1.1fr]">
        <div
          id="publish-form"
          className="rounded-[2rem] border border-white/10 bg-[linear-gradient(180deg,rgba(19,19,19,0.98),rgba(11,11,11,0.94))] p-6"
        >
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-zinc-500">
                Admin-only publishing
              </p>
              <h2 className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-white">
                Post a new offer
              </h2>
            </div>
            <span className="rounded-full border border-[#d8f24d]/20 bg-[#d8f24d]/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-[#d8f24d]">
              Offers only
            </span>
          </div>

          <form action={createOfferAction} className="mt-6 space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <FieldLabel>Title</FieldLabel>
                <Input name="title" placeholder="Golden Hour Ticket Drop" required />
              </div>
              <div>
                <FieldLabel>Slug</FieldLabel>
                <Input name="slug" placeholder="golden-hour-ticket-drop" />
              </div>
            </div>

            <div>
              <FieldLabel>Summary</FieldLabel>
              <Textarea name="summary" rows={3} placeholder="Quick campaign summary for the dashboard and public placements." required />
            </div>

            <div>
              <FieldLabel>Description</FieldLabel>
              <Textarea name="description" rows={4} placeholder="Optional longer explanation for the offer and its conditions." />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <FieldLabel>Image</FieldLabel>
                <Input name="image" placeholder="/offers/golden-hour.jpg" required />
              </div>
              <div>
                <FieldLabel>Venue</FieldLabel>
                <Input name="venue" placeholder="The Arcade / Verve Studio / Events" />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <FieldLabel>Promo code</FieldLabel>
                <Input name="code" placeholder="BLACK20" />
              </div>
              <div>
                <FieldLabel>Discount label</FieldLabel>
                <Input name="discountLabel" placeholder="20% Off" />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <div>
                <FieldLabel>CTA label</FieldLabel>
                <Input name="ctaLabel" placeholder="Claim Offer" />
              </div>
              <div>
                <FieldLabel>Status</FieldLabel>
                <select
                  name="status"
                  defaultValue="active"
                  className="mt-2 min-h-[48px] w-full rounded-[1rem] border border-white/10 bg-black/25 px-4 text-sm text-white outline-none focus:border-[#d8f24d]/35"
                >
                  <option value="draft" className="bg-[#111] text-white">Draft</option>
                  <option value="active" className="bg-[#111] text-white">Active</option>
                  <option value="expired" className="bg-[#111] text-white">Expired</option>
                  <option value="archived" className="bg-[#111] text-white">Archived</option>
                </select>
              </div>
              <div>
                <FieldLabel>Valid until</FieldLabel>
                <Input name="validUntil" type="datetime-local" />
              </div>
            </div>

            <Checkbox name="featured" label="Feature this offer in admin reporting" />

            <div className="flex flex-wrap gap-3 pt-2">
              <button
                type="submit"
                className="inline-flex min-h-[52px] items-center justify-center rounded-full bg-[#d8f24d] px-6 py-3 text-[11px] font-semibold uppercase tracking-[0.24em] text-black transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_18px_44px_rgba(216,242,77,0.22)]"
              >
                Publish offer
              </button>
              <Link
                href="/admin"
                className="inline-flex min-h-[52px] items-center justify-center rounded-full border border-white/10 bg-white/[0.04] px-6 py-3 text-[11px] font-semibold uppercase tracking-[0.24em] text-white transition-all duration-300 hover:border-white/20 hover:bg-white hover:text-black"
              >
                Back to dashboard
              </Link>
            </div>
          </form>
        </div>

        <div className="rounded-[2rem] border border-white/10 bg-[linear-gradient(180deg,rgba(19,19,19,0.98),rgba(11,11,11,0.94))] p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-zinc-500">
                Offer stack
              </p>
              <h2 className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-white">
                Campaign-ready promotions
              </h2>
            </div>
            <Link
              href="/admin"
              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-white transition-all hover:border-white/20 hover:bg-white hover:text-black"
            >
              Back to admin
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="mt-5 space-y-3">
            {offers.length > 0 ? (
              offers.map((offer) => (
                <div key={offer.id} className="rounded-[1.4rem] border border-white/8 bg-black/25 p-4">
                  <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                    <div className="space-y-2">
                      <div className="flex flex-wrap gap-2">
                        <span className="rounded-full border border-white/10 bg-white/[0.05] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-zinc-300">
                          {offer.status}
                        </span>
                        {offer.featured ? (
                          <span className="rounded-full border border-[#d8f24d]/20 bg-[#d8f24d]/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-[#d8f24d]">
                            <Sparkles className="mr-1 inline h-3 w-3" />
                            Featured
                          </span>
                        ) : null}
                      </div>
                      <p className="text-lg font-semibold text-white">{offer.title}</p>
                      <p className="text-sm leading-6 text-zinc-400">{offer.summary}</p>
                      <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">
                        {offer.venue || "Venue-wide"} · Created by {offer.createdByName ?? "Admin"}
                      </p>
                    </div>

                    <div className="grid gap-2 text-right">
                      {offer.discountLabel ? (
                        <span className="rounded-full border border-[#d8f24d]/20 bg-[#d8f24d]/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-[#d8f24d]">
                          <BadgePercent className="mr-1 inline h-3 w-3" />
                          {offer.discountLabel}
                        </span>
                      ) : null}
                      {offer.code ? (
                        <span className="rounded-full border border-white/10 bg-white/[0.05] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-zinc-300">
                          <Gift className="mr-1 inline h-3 w-3" />
                          {offer.code}
                        </span>
                      ) : null}
                      {offer.validUntil ? (
                        <span className="rounded-full border border-white/10 bg-white/[0.05] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-zinc-300">
                          <CalendarClock className="mr-1 inline h-3 w-3" />
                          {format(parseISO(offer.validUntil), "dd MMM")}
                        </span>
                      ) : null}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="rounded-[1.4rem] border border-dashed border-white/10 bg-black/25 p-5 text-sm leading-7 text-zinc-400">
                No offers have been published yet. Use the admin-only form to create the first campaign-ready offer.
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
