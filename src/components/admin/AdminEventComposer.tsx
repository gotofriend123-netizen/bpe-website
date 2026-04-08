"use client";

import Image from "next/image";
import Link from "next/link";
import {
  useEffect,
  useMemo,
  useState,
  type ChangeEvent,
  type InputHTMLAttributes,
  type ReactNode,
  type TextareaHTMLAttributes,
} from "react";
import {
  ChevronLeft,
  ChevronRight,
  Download,
  MapPin,
  Upload,
  X,
} from "lucide-react";

import { pickVenueImage } from "@/lib/content/site-images";
import { type EventCategoryId, EVENT_CATEGORIES } from "@/lib/events/catalog";
import { cn } from "@/lib/utils";

type AdminEventComposerProps = {
  action: (formData: FormData) => void | Promise<void>;
};

type Step = 1 | 2 | 3;

const CATEGORY_OPTIONS = EVENT_CATEGORIES.map((category) => ({
  id: category.id,
  label: category.label,
}));

const PREVIEW_ACCENTS: Record<string, string> = {
  parties: "from-[#365ee8]/70 via-[#223687]/45 to-transparent",
  standup: "from-[#b73e84]/70 via-[#6f204e]/40 to-transparent",
  workshop: "from-[#b69466]/70 via-[#7f633f]/38 to-transparent",
  meetup: "from-[#b53f44]/70 via-[#6a1f24]/40 to-transparent",
  concert: "from-[#5b995d]/70 via-[#2a512f]/38 to-transparent",
  exhibition: "from-[#9ad5ce]/55 via-[#5c847f]/25 to-transparent",
  "live-vibes": "from-[#cb9164]/70 via-[#7d4c27]/38 to-transparent",
  festival: "from-[#7d4fe3]/70 via-[#45218b]/42 to-transparent",
};

function FieldLabel({
  children,
  required = false,
}: {
  children: ReactNode;
  required?: boolean;
}) {
  return (
    <label className="block text-[0.82rem] font-medium text-white/90">
      {children}
      {required ? <span className="ml-1 text-[#ff6666]">*</span> : null}
    </label>
  );
}

function TextInput({
  className,
  ...props
}: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={cn(
        "mt-2 min-h-[52px] w-full rounded-[0.95rem] border border-white/8 bg-black/40 px-4 text-sm text-white outline-none transition-all duration-200 placeholder:text-zinc-500 focus:border-[#d8f24d]/55 focus:bg-white/[0.06]",
        className,
      )}
    />
  );
}

function SelectInput({
  className,
  children,
  ...props
}: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      {...props}
      className={cn(
        "mt-2 min-h-[52px] w-full rounded-[0.95rem] border border-white/8 bg-black/40 px-4 text-sm text-white outline-none transition-all duration-200 focus:border-[#d8f24d]/55 focus:bg-white/[0.06]",
        className,
      )}
    >
      {children}
    </select>
  );
}

function TextBox({
  className,
  ...props
}: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      className={cn(
        "mt-2 w-full rounded-[0.95rem] border border-white/8 bg-black/40 px-4 py-3 text-sm leading-7 text-white outline-none transition-all duration-200 placeholder:text-zinc-500 focus:border-[#d8f24d]/55 focus:bg-white/[0.06]",
        className,
      )}
    />
  );
}

function ToggleField({
  name,
  label,
  defaultChecked = false,
}: {
  name: string;
  label: string;
  defaultChecked?: boolean;
}) {
  return (
    <label className="flex items-center gap-3 rounded-[1rem] border border-white/8 bg-white/[0.03] px-4 py-3 text-sm text-white">
      <input
        type="checkbox"
        name={name}
        defaultChecked={defaultChecked}
        className="h-4 w-4 rounded border-white/20 bg-black text-[#d8f24d] focus:ring-[#d8f24d]/40"
      />
      {label}
    </label>
  );
}

function StepIndicator({
  step,
  label,
  active = false,
}: {
  step: number;
  label: string;
  active?: boolean;
}) {
  return (
    <div className="flex min-w-0 flex-1 flex-col items-center gap-3">
      <div
        className={cn(
          "flex h-11 w-11 items-center justify-center rounded-full text-sm font-semibold transition-all",
          active
            ? "bg-[#d8f24d] text-black shadow-[0_14px_32px_rgba(216,242,77,0.18)]"
            : "bg-white/[0.1] text-zinc-300",
        )}
      >
        {step}
      </div>
      <div className="w-full max-w-[84px] border-t border-white/10" />
      <p
        className={cn(
          "text-center text-[0.82rem] font-medium",
          active ? "text-[#d8f24d]" : "text-zinc-400",
        )}
      >
        {label}
      </p>
    </div>
  );
}

function FileTrigger({
  id,
  label,
  fileName,
  buttonTone = "primary",
  onClear,
}: {
  id: string;
  label: string;
  fileName: string;
  buttonTone?: "primary" | "secondary";
  onClear?: () => void;
}) {
  return (
    <div className="mt-2">
      <div className="flex flex-wrap items-center gap-3">
        <label
          htmlFor={id}
          className={cn(
            "inline-flex min-h-[44px] cursor-pointer items-center justify-center rounded-[0.8rem] px-4 text-[0.82rem] font-semibold transition-all",
            buttonTone === "primary"
              ? "bg-[#bcd437] text-black hover:bg-[#d8f24d]"
              : "bg-[#343434] text-white hover:bg-[#404040]",
          )}
        >
          <Upload className="mr-2 h-4 w-4" />
          {label}
        </label>
        <span className="min-w-0 flex-1 truncate text-sm text-zinc-400">{fileName}</span>
      </div>
      {onClear ? (
        <button
          type="button"
          onClick={onClear}
          className="mt-2 inline-flex h-7 w-7 items-center justify-center rounded-full bg-[#df4f4f] text-white transition-all hover:bg-[#f45c5c]"
          aria-label="Clear selected file"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      ) : null}
    </div>
  );
}

export function AdminEventComposer({ action }: AdminEventComposerProps) {
  const [currentStep, setCurrentStep] = useState<Step>(1);

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<EventCategoryId>(CATEGORY_OPTIONS[0]?.id ?? "concert");
  const [summary, setSummary] = useState("");
  const [teaser, setTeaser] = useState("");
  const [city, setCity] = useState("Raipur");
  const [stateRegion, setStateRegion] = useState("Chhattisgarh");
  const [venue, setVenue] = useState("The Arcade");
  const [address, setAddress] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [dateType, setDateType] = useState("single_day");
  const [priceType, setPriceType] = useState("paid");
  const [priceFrom, setPriceFrom] = useState("799");
  const [ticketLabel, setTicketLabel] = useState("General Access");
  const [ticketDescription, setTicketDescription] = useState("Premium event entry with core access perks.");
  const [ticketPerks, setTicketPerks] = useState("Entry access\nCurated event experience");
  const [highlights, setHighlights] = useState("Premium venue atmosphere\nCurated crowd experience");
  const [description, setDescription] = useState(
    "A premium event experience designed for high-energy guests.\nExpect polished production, strong pacing, and a refined on-ground atmosphere.",
  );
  const [policies, setPolicies] = useState(
    "Tickets are non-refundable once confirmed.\nPlease arrive 20 minutes before the event starts.",
  );
  const [posterImagePath, setPosterImagePath] = useState("");
  const [coverImagePath, setCoverImagePath] = useState("");

  const [posterPreviewUrl, setPosterPreviewUrl] = useState<string>(pickVenueImage(0));
  const [posterFileName, setPosterFileName] = useState("No poster selected");
  const [coverFileName, setCoverFileName] = useState("No file chosen");
  const [videoFileName, setVideoFileName] = useState("No file chosen");
  const [posterObjectUrl, setPosterObjectUrl] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      if (posterObjectUrl) {
        URL.revokeObjectURL(posterObjectUrl);
      }
    };
  }, [posterObjectUrl]);

  const categoryLabel = useMemo(
    () => CATEGORY_OPTIONS.find((option) => option.id === category)?.label ?? "Event",
    [category],
  );

  const previewAccent = PREVIEW_ACCENTS[category] ?? PREVIEW_ACCENTS.concert;

  const metadataLine = useMemo(() => {
    const parts = [city, stateRegion].filter(Boolean);
    return parts.join(", ");
  }, [city, stateRegion]);

  const startsAt = eventDate && startTime ? `${eventDate}T${startTime}` : "";
  const endsAt = eventDate && endTime ? `${eventDate}T${endTime}` : "";

  const stepOneReady = title.trim().length >= 1;
  const stepTwoReady = address.trim().length >= 1;
  const stepThreeReady = Number(priceFrom) >= 0;

  const canAdvance =
    (currentStep === 1 && stepOneReady) ||
    (currentStep === 2 && stepTwoReady) ||
    currentStep === 3;

  const handlePosterChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) return;

    if (posterObjectUrl) {
      URL.revokeObjectURL(posterObjectUrl);
    }

    const url = URL.createObjectURL(file);
    setPosterObjectUrl(url);
    setPosterPreviewUrl(url);
    setPosterFileName(file.name);
  };

  const handlePosterClear = () => {
    if (posterObjectUrl) {
      URL.revokeObjectURL(posterObjectUrl);
    }
    setPosterObjectUrl(null);
    setPosterPreviewUrl(pickVenueImage(0));
    setPosterFileName("No poster selected");

    const input = document.getElementById("posterFile") as HTMLInputElement | null;
    if (input) input.value = "";
  };

  const handleCoverChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setCoverFileName(file.name);
  };

  const handleCoverClear = () => {
    setCoverFileName("No file chosen");
    const input = document.getElementById("coverFile") as HTMLInputElement | null;
    if (input) input.value = "";
  };

  const handleVideoChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setVideoFileName(file.name);
  };

  const handleNext = () => {
    if (currentStep < 3 && canAdvance) {
      setCurrentStep((currentStep + 1) as Step);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((currentStep - 1) as Step);
    }
  };

  return (
    <section className="grid gap-6 xl:grid-cols-[0.98fr_1.02fr]">
      <aside className="xl:sticky xl:top-6 xl:self-start rounded-[2rem] border border-white/8 bg-white/[0.03] p-4 sm:p-5">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-[1.7rem] font-semibold tracking-[-0.04em] text-[#d8f24d]">Poster Preview</p>
          </div>
          <button
            type="button"
            className="inline-flex min-h-[40px] items-center justify-center rounded-[0.8rem] bg-[#d8f24d] px-4 text-[0.82rem] font-semibold text-black transition-all hover:bg-[#e4fa67]"
          >
            <Download className="mr-2 h-4 w-4" />
            Download
          </button>
        </div>

        <div className="mt-4 rounded-[1.45rem] border border-white/8 bg-black/40 p-3">
          <div className="relative aspect-[4/5] overflow-hidden rounded-[1.2rem] bg-black">
            <Image
              src={posterPreviewUrl}
              alt="Event poster preview"
              fill
              unoptimized
              sizes="(max-width: 1280px) 100vw, 40vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.25),rgba(0,0,0,0.82))]" />
            <div className={cn("absolute inset-0 bg-gradient-to-t", previewAccent)} />
            <div className="absolute left-5 top-5 text-[1.9rem] font-black tracking-[-0.05em] text-[#d8f24d]">
              BLACK PEPPER
            </div>
            <div className="absolute inset-x-0 bottom-0 p-5">
              <span className="inline-flex rounded-full bg-[#d8f24d] px-3 py-1 text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-black">
                {categoryLabel}
              </span>
              <h3 className="mt-3 text-[2.2rem] font-semibold leading-[0.94] tracking-[-0.06em] text-white">
                {title.trim() || "Your Event"}
              </h3>
              <div className="mt-2 flex items-center gap-2 text-sm text-white/80">
                <MapPin className="h-4 w-4 text-white/70" />
                <span>{metadataLine || "City, State"}</span>
              </div>
            </div>
          </div>

          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <button
              type="button"
              className="inline-flex min-h-[44px] items-center justify-center rounded-[0.9rem] bg-white/[0.08] px-4 text-[0.82rem] font-medium text-[#d8f24d] transition-all hover:bg-white/[0.12]"
            >
              Toggle QR Code
            </button>
            <button
              type="button"
              className="inline-flex min-h-[44px] items-center justify-center rounded-[0.9rem] bg-white/[0.08] px-4 text-[0.82rem] font-medium text-[#d8f24d] transition-all hover:bg-white/[0.12]"
            >
              Change Style
            </button>
          </div>
        </div>
      </aside>

      <div className="rounded-[2rem] border border-white/8 bg-white/[0.03] p-5 sm:p-7">
        <div className="text-center">
          <h2 className="text-[2.2rem] font-semibold tracking-[-0.05em] text-[#d8f24d] sm:text-[2.8rem]">
            Create Event
          </h2>

          <div className="mt-7 grid grid-cols-3 gap-2 md:gap-4">
            <StepIndicator step={1} label="Event Details" active={currentStep === 1} />
            <StepIndicator step={2} label="Location" active={currentStep === 2} />
            <StepIndicator step={3} label="Pricing & Tickets" active={currentStep === 3} />
          </div>
        </div>

        <form action={action} encType="multipart/form-data" className="mt-8">
          <input type="hidden" name="title" value={title} />
          <input type="hidden" name="category" value={category} />
          <input type="hidden" name="summary" value={summary} />
          <input type="hidden" name="teaser" value={teaser} />
          <input type="hidden" name="slug" value={title.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")} />
          <input type="hidden" name="venue" value={venue} />
          <input type="hidden" name="organizer" value="Black Pepper Entertainment" />
          <input type="hidden" name="city" value={city} />
          <input type="hidden" name="startsAt" value={startsAt} />
          <input type="hidden" name="endsAt" value={endsAt} />
          <input type="hidden" name="priceFrom" value={priceFrom} />
          <input type="hidden" name="metadataLine" value={`${venue} • ${city}, ${stateRegion}`} />
          <input type="hidden" name="ticketLabel" value={ticketLabel} />
          <input type="hidden" name="ticketDescription" value={ticketDescription} />
          <input type="hidden" name="ticketPerks" value={ticketPerks} />
          <input type="hidden" name="highlights" value={highlights} />
          <input type="hidden" name="description" value={description} />
          <input type="hidden" name="policies" value={policies} />
          <input type="hidden" name="posterImage" value={posterImagePath} />
          <input type="hidden" name="coverImage" value={coverImagePath} />
          <input type="hidden" name="availability" value="available" />

          <section className={cn("space-y-5", currentStep !== 1 && "hidden")}>
            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <FieldLabel required>Cover Images</FieldLabel>
                <input
                  id="posterFile"
                  name="posterFile"
                  type="file"
                  accept="image/png,image/jpeg,image/webp,image/avif"
                  className="sr-only"
                  onChange={handlePosterChange}
                />
                <FileTrigger
                  id="posterFile"
                  label="Choose Files"
                  fileName={posterFileName}
                  onClear={posterFileName !== "No poster selected" ? handlePosterClear : undefined}
                />
              </div>

              <div>
                <FieldLabel>Hero Banner</FieldLabel>
                <input
                  id="coverFile"
                  name="coverFile"
                  type="file"
                  accept="image/png,image/jpeg,image/webp,image/avif"
                  className="sr-only"
                  onChange={handleCoverChange}
                />
                <FileTrigger
                  id="coverFile"
                  label="Choose File"
                  fileName={coverFileName}
                  buttonTone="secondary"
                  onClear={coverFileName !== "No file chosen" ? handleCoverClear : undefined}
                />
              </div>
            </div>

            <div>
              <FieldLabel>Event Video</FieldLabel>
              <input
                id="eventVideo"
                type="file"
                accept="video/*"
                className="sr-only"
                onChange={handleVideoChange}
              />
              <FileTrigger id="eventVideo" label="Choose File" fileName={videoFileName} buttonTone="secondary" />
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <FieldLabel>Poster path override</FieldLabel>
                <TextInput
                  placeholder="/uploads/events/my-event-poster.jpg"
                  value={posterImagePath}
                  onChange={(event) => setPosterImagePath(event.target.value)}
                />
              </div>
              <div>
                <FieldLabel>Cover path override</FieldLabel>
                <TextInput
                  placeholder="/uploads/events/my-event-cover.jpg"
                  value={coverImagePath}
                  onChange={(event) => setCoverImagePath(event.target.value)}
                />
              </div>
            </div>

            <div>
              <FieldLabel required>Title</FieldLabel>
              <TextInput
                placeholder="Enter your event title"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
              />
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <FieldLabel required>Type</FieldLabel>
                <SelectInput value={category} onChange={(event) => setCategory(event.target.value as EventCategoryId)}>
                  {CATEGORY_OPTIONS.map((option) => (
                    <option key={option.id} value={option.id} className="bg-[#191919] text-white">
                      {option.label}
                    </option>
                  ))}
                </SelectInput>
              </div>
            </div>

            <div>
              <FieldLabel required>Short Summary</FieldLabel>
              <TextBox
                rows={3}
                placeholder="Add a concise event summary for previews and cards."
                value={summary}
                onChange={(event) => setSummary(event.target.value)}
              />
            </div>

            <div>
              <FieldLabel required>Hero Teaser</FieldLabel>
              <TextBox
                rows={3}
                placeholder="Add a richer teaser that appears in the event hero."
                value={teaser}
                onChange={(event) => setTeaser(event.target.value)}
              />
            </div>
          </section>

          <section className={cn("space-y-5", currentStep !== 2 && "hidden")}>
            <div>
              <FieldLabel required>Address</FieldLabel>
              <TextInput
                placeholder="Enter a location"
                value={address}
                onChange={(event) => setAddress(event.target.value)}
              />
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <FieldLabel required>City</FieldLabel>
                <TextInput placeholder="City" value={city} onChange={(event) => setCity(event.target.value)} />
              </div>
              <div>
                <FieldLabel required>State</FieldLabel>
                <TextInput
                  placeholder="State"
                  value={stateRegion}
                  onChange={(event) => setStateRegion(event.target.value)}
                />
              </div>
            </div>

            <div>
              <FieldLabel>Venue</FieldLabel>
              <TextInput placeholder="Enter venue name" value={venue} onChange={(event) => setVenue(event.target.value)} />
            </div>

            <div>
              <FieldLabel>Date Type</FieldLabel>
              <SelectInput value={dateType} onChange={(event) => setDateType(event.target.value)}>
                <option value="single_day" className="bg-[#191919] text-white">
                  Single Day
                </option>
                <option value="multi_day" className="bg-[#191919] text-white">
                  Multi Day
                </option>
              </SelectInput>
            </div>

            <div>
              <FieldLabel required>Event Date</FieldLabel>
              <TextInput type="date" value={eventDate} onChange={(event) => setEventDate(event.target.value)} />
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <FieldLabel required>Start Time</FieldLabel>
                <TextInput type="time" value={startTime} onChange={(event) => setStartTime(event.target.value)} />
              </div>
              <div>
                <FieldLabel required>End Time</FieldLabel>
                <TextInput type="time" value={endTime} onChange={(event) => setEndTime(event.target.value)} />
              </div>
            </div>
          </section>

          <section className={cn("space-y-5", currentStep !== 3 && "hidden")}>
            <div>
              <FieldLabel required>Price Type</FieldLabel>
              <SelectInput value={priceType} onChange={(event) => setPriceType(event.target.value)}>
                <option value="paid" className="bg-[#191919] text-white">
                  Paid Entry
                </option>
                <option value="free" className="bg-[#191919] text-white">
                  Free Entry
                </option>
                <option value="invite" className="bg-[#191919] text-white">
                  Invite Only
                </option>
              </SelectInput>
            </div>

            <div className="grid gap-5 md:grid-cols-3">
              <div>
                <FieldLabel required>Starting Price</FieldLabel>
                <TextInput
                  type="number"
                  min="0"
                  placeholder="799"
                  value={priceFrom}
                  onChange={(event) => setPriceFrom(event.target.value)}
                />
              </div>
              <div>
                <FieldLabel required>Ticket Label</FieldLabel>
                <TextInput
                  placeholder="General Access"
                  value={ticketLabel}
                  onChange={(event) => setTicketLabel(event.target.value)}
                />
              </div>
            </div>

            <div>
              <FieldLabel required>Ticket Description</FieldLabel>
              <TextInput
                placeholder="Explain what this ticket unlocks."
                value={ticketDescription}
                onChange={(event) => setTicketDescription(event.target.value)}
              />
            </div>

            <div className="grid gap-5 md:grid-cols-3">
              <div>
                <FieldLabel required>Ticket Perks</FieldLabel>
                <TextBox rows={5} value={ticketPerks} onChange={(event) => setTicketPerks(event.target.value)} />
              </div>
              <div>
                <FieldLabel required>Highlights</FieldLabel>
                <TextBox rows={5} value={highlights} onChange={(event) => setHighlights(event.target.value)} />
              </div>
              <div>
                <FieldLabel required>Policies</FieldLabel>
                <TextBox rows={5} value={policies} onChange={(event) => setPolicies(event.target.value)} />
              </div>
            </div>

            <div>
              <FieldLabel required>Full Description</FieldLabel>
              <TextBox rows={5} value={description} onChange={(event) => setDescription(event.target.value)} />
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <ToggleField name="hot" label="Mark as hot-selling" />
              <ToggleField name="featured" label="Feature on /events" />
              <ToggleField name="trending" label="Include in trending" />
              <ToggleField name="homepage" label="Show on homepage preview" />
              <ToggleField name="published" label="Publish immediately" defaultChecked />
            </div>
          </section>

          <div className="mt-7 flex items-center justify-between gap-4">
            <button
              type="button"
              onClick={handleBack}
              disabled={currentStep === 1}
              className={cn(
                "inline-flex h-12 min-w-[68px] items-center justify-center rounded-[0.8rem] bg-[#3b3b3b] text-white transition-all",
                currentStep === 1 ? "cursor-not-allowed opacity-45" : "hover:bg-[#454545]",
              )}
            >
              <ChevronLeft className="h-5 w-5" />
            </button>

            {currentStep < 3 ? (
              <button
                type="button"
                onClick={handleNext}
                disabled={!canAdvance}
                className={cn(
                  "inline-flex h-12 min-w-[68px] items-center justify-center rounded-[0.8rem] bg-[#bcd437] px-5 text-black transition-all",
                  !canAdvance ? "cursor-not-allowed opacity-45" : "hover:bg-[#d8f24d]",
                )}
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            ) : (
              <button
                type="submit"
                disabled={!stepThreeReady}
                className={cn(
                  "inline-flex min-h-[52px] items-center justify-center rounded-[0.8rem] bg-[#d8f24d] px-6 text-sm font-semibold text-black transition-all hover:bg-[#e4fa67]",
                  !stepThreeReady && "cursor-not-allowed opacity-45",
                )}
              >
                Create Event
              </button>
            )}
          </div>

          <div className="mt-4 flex items-center justify-end">
            <Link
              href="/events"
              className="text-sm font-medium text-white/70 transition-colors hover:text-white"
            >
              Preview public events
            </Link>
          </div>
        </form>
      </div>
    </section>
  );
}
