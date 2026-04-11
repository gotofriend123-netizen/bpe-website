import { Suspense } from "react";

import { BookingPageClient } from "@/app/booking/BookingPageClient";
import { getPublicBookingSettings } from "@/lib/booking/settings";

export default async function BookingPage() {
  const settings = await getPublicBookingSettings();

  return (
    <Suspense
      fallback={<div className="min-h-screen bg-[#020202] pt-32 text-white" />}
    >
      <BookingPageClient
        defaultBookingDurationHours={settings.defaultBookingDurationHours}
      />
    </Suspense>
  );
}
