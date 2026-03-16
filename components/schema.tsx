export default function Schema() {
  const sportsLocationJsonLd = {
    "@context": "https://schema.org",
    "@type": "SportsActivityLocation",
    "name": "Padel Gravity Subotica",
    "description": "Doživite vrhunsku padel kulturu u Padel Gravity Subotica. 4 moderna terena, premium kafić i živopisna zajednica.",
    "image": "/hero.jpeg",
    "@id": "https://padelgravity.rs",
    "url": "https://padelgravity.rs",
    "telephone": "+381606558559",
    "priceRange": "$$",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Severna 7",
      "addressLocality": "Subotica",
      "postalCode": "24000",
      "addressCountry": "RS"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 46.1003,
      "longitude": 19.6676
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
      "opens": "08:00",
      "closes": "23:00"
    },
    "sameAs": [
      "https://www.instagram.com/padel.gravity/",
      "https://www.facebook.com/padel.gravity.subotica"
    ],
    "potentialAction": {
      "@type": "ReserveAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": "https://padelgravity.rs/#booking",
        "actionPlatform": [
          "http://schema.org/DesktopWebPlatform",
          "http://schema.org/MobileWebPlatform"
        ]
      },
      "result": {
        "@type": "Reservation",
        "name": "Rezerviši Padel Teren"
      }
    }
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Početna",
        "item": "https://padelgravity.rs"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "O nama",
        "item": "https://padelgravity.rs/#about"
      }
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([sportsLocationJsonLd, breadcrumbJsonLd]),
        }}
      />
    </>
  );
}
