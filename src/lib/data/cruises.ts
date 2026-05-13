export type SeatState = "available" | "held" | "selected" | "sold"

export type Cruise = {
  id: string
  slug: string
  title: string
  subtitle: string
  duration: string
  time: string
  price: number
  seatsLeft: number
  capacity: number
  mood: string
  description: string
  highlights: string[]
  imagePosition: string
}

export type Sailing = {
  id: string
  cruiseSlug: string
  startsAt: string
  label: string
  price: number
  seatsLeft: number
}

export const cruises: Cruise[] = [
  {
    id: "cruise_dawn",
    slug: "dawn-on-the-ghats",
    title: "Dawn on the Ghats",
    subtitle: "A quiet sunrise passage through blue-hour Varanasi.",
    duration: "90 min",
    time: "05:15",
    price: 2800,
    seatsLeft: 14,
    capacity: 36,
    mood: "Sunrise",
    description:
      "Tea, soft commentary, temple silhouettes, and a slow return as the ghats warm into morning light.",
    highlights: ["Hosted boarding", "Morning tea", "Small group deck", "QR ticket"],
    imagePosition: "52% 48%",
  },
  {
    id: "cruise_aarti",
    slug: "evening-aarti-reserve",
    title: "Evening Aarti Reserve",
    subtitle: "A composed river view of the ceremony from a premium deck.",
    duration: "110 min",
    time: "17:45",
    price: 4200,
    seatsLeft: 8,
    capacity: 32,
    mood: "Aarti",
    description:
      "Reserved boarding, warm service, and a cinematic view of lamps, sound, reflection, and stone.",
    highlights: ["Reserved seating", "Premium deck", "Evening refreshments", "Live availability"],
    imagePosition: "72% 55%",
  },
  {
    id: "cruise_private",
    slug: "private-celebration",
    title: "Private Celebration",
    subtitle: "A tailored river evening for families, founders, and wedding guests.",
    duration: "2-3 hrs",
    time: "By request",
    price: 55000,
    seatsLeft: 1,
    capacity: 48,
    mood: "Private",
    description:
      "A private hosted cruise with flexible timing, curated hospitality, and a route shaped around your moment.",
    highlights: ["Private vessel", "Custom route", "Event host", "Concierge planning"],
    imagePosition: "84% 60%",
  },
]

export const sailings: Sailing[] = [
  {
    id: "sailing_dawn_today",
    cruiseSlug: "dawn-on-the-ghats",
    startsAt: "2026-05-13T05:15:00+05:30",
    label: "Tomorrow, 05:15",
    price: 2800,
    seatsLeft: 14,
  },
  {
    id: "sailing_aarti_today",
    cruiseSlug: "evening-aarti-reserve",
    startsAt: "2026-05-12T17:45:00+05:30",
    label: "Today, 17:45",
    price: 4200,
    seatsLeft: 8,
  },
  {
    id: "sailing_private",
    cruiseSlug: "private-celebration",
    startsAt: "2026-05-14T18:30:00+05:30",
    label: "Private slot, 18:30",
    price: 55000,
    seatsLeft: 1,
  },
]

export const seats = Array.from({ length: 32 }, (_, index) => {
  const sold = [3, 7, 14, 21, 27].includes(index)
  const held = [5, 18].includes(index)

  return {
    id: `S${String(index + 1).padStart(2, "0")}`,
    label: `Seat ${index + 1}`,
    category: index < 8 ? "front deck" : index < 20 ? "premium" : "standard",
    state: sold ? "sold" : held ? "held" : ("available" as SeatState),
  }
})

export function getCruiseBySlug(slug: string) {
  return cruises.find((cruise) => cruise.slug === slug)
}

export function getSailingById(id: string) {
  return sailings.find((sailing) => sailing.id === id)
}

export function formatPrice(value: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value)
}
