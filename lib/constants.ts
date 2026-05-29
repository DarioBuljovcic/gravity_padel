// lib/constants.ts
export const OPENING_HOUR = 9;   // 09:00
export const CLOSING_HOUR = 23;  // 23:00
export const MIN_SLOT_MINUTES = 60;

export const pricingData = {
  morning: {
    title: "Radni Dani",
    subtitle: "Pre podne",
    range: "09:00 - 16:00",
    items: [
      { duration: "1h", price: "1.800 RSD" },
      { duration: "1.5h", price: "2.700 RSD" },
      { duration: "2h", price: "3.300 RSD" }
    ]
  },
  afternoon: {
    title: "Radni Dani",
    subtitle: "Posle podne",
    range: "16:00 - 23:00",
    items: [
      { duration: "1h", price: "2.400 RSD" },
      { duration: "1.5h", price: "3.600 RSD" },
      { duration: "2h", price: "4.400 RSD" }
    ]
  }
};
