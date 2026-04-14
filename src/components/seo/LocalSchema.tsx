// using raw script tag to strictly avoid next/script hydration conflicts in json-ld

export function OrganizationSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Black Pepper Entertainment",
    "url": "https://blackpepperentertainment.in",
    "logo": "https://blackpepperentertainment.in/BLACK PEPPER LOGO  WIGHT PNG.png",
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+91-9203411611",
      "contactType": "Customer Service",
      "areaServed": "IN",
      "availableLanguage": ["English", "Hindi"]
    },
    "sameAs": [
      "https://www.instagram.com/blackpepperentertainment/"
    ]
  };

  return (
    <script
      id="organization-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function LocalBusinessSchema({
  title,
  description,
  url,
  image
}: {
  title: string;
  description: string;
  url: string;
  image: string;
}) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "EventVenue",
    "name": title,
    "image": [image],
    "url": url,
    "telephone": "+91-9203411611",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Arcade Community Hall, Near Hotel Royal Avenue",
      "addressLocality": "Raipur",
      "addressRegion": "Chhattisgarh",
      "postalCode": "492001",
      "addressCountry": "IN"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 21.2370717,
      "longitude": 81.6502598
    },
    "openingHoursSpecification": {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday"
      ],
      "opens": "09:00",
      "closes": "23:00"
    },
    "priceRange": "₹₹₹",
    "description": description
  };

  return (
    <script
      id={`local-schema-${title.replace(/\s+/g, '-').toLowerCase()}`}
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function FAQSchema({ faqs }: { faqs: { q: string; a: string; }[] }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.q,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.a
      }
    }))
  };

  return (
    <script
      id="faq-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
