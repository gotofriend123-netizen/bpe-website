/**
 * GA4 conversion tracking utilities for Black Pepper Entertainment
 * Tracks: view_item, begin_checkout, purchase events
 */

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

export function gtag(...args: unknown[]) {
  if (typeof window !== "undefined" && typeof window.gtag === "function") {
    window.gtag(...args);
  }
}

// Track when a user views a space detail page
export function trackViewItem(space: { id: string; name: string; price?: number }) {
  gtag("event", "view_item", {
    currency: "INR",
    items: [
      {
        item_id: space.id,
        item_name: space.name,
        item_category: "Venue",
        price: space.price,
      },
    ],
  });
}

// Track when a user starts the booking flow
export function trackBeginCheckout(space: { id: string; name: string; price?: number; packageName?: string }) {
  gtag("event", "begin_checkout", {
    currency: "INR",
    value: space.price,
    items: [
      {
        item_id: space.id,
        item_name: space.name,
        item_category: "Venue Booking",
        item_variant: space.packageName,
        price: space.price,
        quantity: 1,
      },
    ],
  });
}

// Track completed booking / purchase
export function trackPurchase(booking: {
  bookingId: string;
  spaceName: string;
  spaceId: string;
  amount: number;
  packageName?: string;
}) {
  gtag("event", "purchase", {
    transaction_id: booking.bookingId,
    currency: "INR",
    value: booking.amount,
    items: [
      {
        item_id: booking.spaceId,
        item_name: booking.spaceName,
        item_category: "Venue Booking",
        item_variant: booking.packageName,
        price: booking.amount,
        quantity: 1,
      },
    ],
  });
}

// Generic CTA click tracking
export function trackCTAClick(label: string, location: string) {
  gtag("event", "cta_click", {
    event_label: label,
    event_category: "CTA",
    page_location: location,
  });
}

// Track pricing page view
export function trackPricingView(space?: string) {
  gtag("event", "view_item_list", {
    item_list_name: space ? `${space} Pricing` : "All Pricing",
    items: space
      ? [{ item_name: space, item_category: "Venue Pricing" }]
      : [
          { item_name: "The Arcade", item_category: "Venue Pricing" },
          { item_name: "Verve Studio", item_category: "Venue Pricing" },
        ],
  });
}
