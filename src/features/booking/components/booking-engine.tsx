"use client"

import {
  ArrowRight,
  CalendarDays,
  Crown,
  Info,
  MapPin,
  Move,
  ShieldCheck,
  TimerReset,
  UsersRound,
  ZoomIn,
  ZoomOut,
} from "lucide-react"
import { motion } from "framer-motion"
import { useEffect, useMemo, useRef, useState } from "react"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import { motionEasings } from "@/design/motion"
import { type SeatState, formatPrice, seats } from "@/lib/data/cruises"
import { cn } from "@/lib/utils"

import {
  type GuestDetails,
  readAdminBookings,
  readAdminSeatLocks,
  saveBookingSnapshot,
} from "../lib/booking-state"

type BookingEngineProps = {
  sailingId: string
  title: string
  price: number
  location: string
  date: string
  initialGuests: number
}

type DeckSeatLayout = {
  x: number
  y: number
  zone: string
}

type HoverSeat = {
  id: string
  label: string
  zone: string
  state: SeatState | "selected"
  x: number
  y: number
}

const deckSeatLayout: DeckSeatLayout[] = [
  { x: 304, y: 132, zone: "Sky lounge" },
  { x: 374, y: 118, zone: "Sky lounge" },
  { x: 444, y: 112, zone: "Sky lounge" },
  { x: 514, y: 118, zone: "Sky lounge" },
  { x: 584, y: 132, zone: "Sky lounge" },
  { x: 346, y: 176, zone: "Sky lounge" },
  { x: 444, y: 168, zone: "Sky lounge" },
  { x: 542, y: 176, zone: "Sky lounge" },
  { x: 260, y: 222, zone: "Orchid lounge" },
  { x: 340, y: 220, zone: "Orchid lounge" },
  { x: 420, y: 220, zone: "Orchid lounge" },
  { x: 500, y: 220, zone: "Orchid lounge" },
  { x: 580, y: 220, zone: "Orchid lounge" },
  { x: 660, y: 222, zone: "Orchid lounge" },
  { x: 300, y: 272, zone: "Orchid lounge" },
  { x: 380, y: 272, zone: "Orchid lounge" },
  { x: 460, y: 272, zone: "Orchid lounge" },
  { x: 540, y: 272, zone: "Orchid lounge" },
  { x: 620, y: 272, zone: "Orchid lounge" },
  { x: 700, y: 272, zone: "Orchid lounge" },
  { x: 248, y: 336, zone: "River salon" },
  { x: 338, y: 336, zone: "River salon" },
  { x: 428, y: 336, zone: "River salon" },
  { x: 518, y: 336, zone: "River salon" },
  { x: 608, y: 336, zone: "River salon" },
  { x: 698, y: 336, zone: "River salon" },
  { x: 302, y: 408, zone: "Aft terrace" },
  { x: 382, y: 422, zone: "Aft terrace" },
  { x: 462, y: 432, zone: "Aft terrace" },
  { x: 542, y: 422, zone: "Aft terrace" },
  { x: 622, y: 408, zone: "Aft terrace" },
  { x: 462, y: 486, zone: "Aft terrace" },
]

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value))
}

export function BookingEngine({
  sailingId,
  title,
  price,
  location,
  date,
  initialGuests,
}: BookingEngineProps) {
  const router = useRouter()
  const viewportRef = useRef<HTMLDivElement | null>(null)
  const [lockedSeats, setLockedSeats] = useState<string[]>([])
  const [soldSeats, setSoldSeats] = useState<string[]>([])
  const [selected, setSelected] = useState<string[]>([])
  const [secondsLeft, setSecondsLeft] = useState(9 * 60 + 42)
  const [guest, setGuest] = useState<GuestDetails>({
    name: "",
    email: "",
    phone: "",
  })
  const [zoom, setZoom] = useState(1)
  const [pan, setPan] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragOrigin, setDragOrigin] = useState({ x: 0, y: 0 })
  const [hoverSeat, setHoverSeat] = useState<HoverSeat | null>(null)

  const selectedTotal = selected.length * price
  const tax = Math.round(selectedTotal * 0.05)
  const total = selectedTotal + tax
  const canContinue = Boolean(
    selected.length > 0 && guest.name.trim() && guest.email.trim() && guest.phone.trim(),
  )

  const timerLabel = useMemo(() => {
    const minutes = Math.floor(secondsLeft / 60)
    const seconds = secondsLeft % 60
    return `${minutes}:${String(seconds).padStart(2, "0")}`
  }, [secondsLeft])

  useEffect(() => {
    const timer = window.setInterval(() => {
      setSecondsLeft((value) => Math.max(value - 1, 0))
    }, 1000)

    return () => window.clearInterval(timer)
  }, [])

  useEffect(() => {
    function syncSeatState() {
      const adminLocks = readAdminSeatLocks()
        .filter((lock) => lock.sailingId === sailingId)
        .flatMap((lock) => lock.seats)
      const adminSold = readAdminBookings()
        .filter((booking) => booking.sailingId === sailingId)
        .flatMap((booking) => booking.seats)

      setLockedSeats(Array.from(new Set(adminLocks)))
      setSoldSeats(Array.from(new Set(adminSold)))
    }

    syncSeatState()
    window.addEventListener("storage", syncSeatState)
    window.addEventListener("focus", syncSeatState)

    return () => {
      window.removeEventListener("storage", syncSeatState)
      window.removeEventListener("focus", syncSeatState)
    }
  }, [sailingId])

  const mergedSeats = useMemo(
    () =>
      seats.map((seat) => {
        if (soldSeats.includes(seat.id)) {
          return { ...seat, state: "sold" as SeatState }
        }

        if (lockedSeats.includes(seat.id)) {
          return { ...seat, state: "held" as SeatState }
        }

        return seat
      }),
    [lockedSeats, soldSeats],
  )

  const deckSeats = useMemo(
    () =>
      mergedSeats.map((seat, index) => ({
        ...seat,
        ...deckSeatLayout[index],
      })),
    [mergedSeats],
  )

  useEffect(() => {
    const preferred = mergedSeats
      .filter((seat) => seat.state === "available")
      .slice(0, Math.min(initialGuests, 12))
      .map((seat) => seat.id)

    setSelected((current) => {
      const valid = current.filter((seatId) => {
        const matchedSeat = mergedSeats.find((seat) => seat.id === seatId)
        return matchedSeat?.state === "available"
      })

      if (valid.length > 0) {
        return valid
      }

      return preferred
    })
  }, [initialGuests, mergedSeats])

  function toggleSeat(id: string, state: SeatState) {
    if (state === "sold" || state === "held") {
      return
    }

    setSelected((current) =>
      current.includes(id)
        ? current.filter((seatId) => seatId !== id)
        : [...current, id],
    )
  }

  function updateGuest(field: keyof GuestDetails, value: string) {
    setGuest((current) => ({ ...current, [field]: value }))
  }

  function continueToPayment() {
    if (!canContinue) {
      return
    }

    const bookingId = `booking_${sailingId}_${selected.join("-").toLowerCase()}`

    saveBookingSnapshot({
      id: bookingId,
      sailingId,
      cruiseTitle: title,
      location,
      date,
      guests: initialGuests,
      seats: selected,
      subtotal: selectedTotal,
      tax,
      total,
      guest,
      status: "held",
    })

    router.push(`/checkout/${bookingId}?seats=${selected.join(",")}`, {
      scroll: false,
    })
  }

  function adjustZoom(delta: number) {
    setZoom((current) => clamp(current + delta, 0.85, 1.8))
  }

  function resetView() {
    setZoom(1)
    setPan({ x: 0, y: 0 })
  }

  function handleWheel(event: React.WheelEvent<HTMLDivElement>) {
    event.preventDefault()
    const next = event.deltaY > 0 ? -0.08 : 0.08
    adjustZoom(next)
  }

  function handlePointerDown(event: React.PointerEvent<HTMLDivElement>) {
    if (zoom <= 1) {
      return
    }

    setIsDragging(true)
    setDragOrigin({ x: event.clientX - pan.x, y: event.clientY - pan.y })
  }

  function handlePointerMove(event: React.PointerEvent<HTMLDivElement>) {
    if (!isDragging) {
      return
    }

    setPan({
      x: event.clientX - dragOrigin.x,
      y: event.clientY - dragOrigin.y,
    })
  }

  function stopDragging() {
    setIsDragging(false)
  }

  const stats = [
    {
      label: "Boarding",
      value: location,
      icon: MapPin,
    },
    {
      label: "Departure",
      value: date,
      icon: CalendarDays,
    },
    {
      label: "Travelers",
      value: `${initialGuests}`,
      icon: UsersRound,
    },
  ]

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
      <div className="grid gap-6">
        <section className="overflow-hidden rounded-[32px] border border-white/10 bg-[radial-gradient(circle_at_top,rgba(122,100,255,0.16),transparent_38%),linear-gradient(180deg,rgba(10,11,16,0.98),rgba(7,8,12,0.98))] shadow-[0_40px_120px_rgba(0,0,0,0.45)]">
          <div className="border-b border-white/8 px-5 py-5 sm:px-7">
            <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
              <div>
                <div className="flex flex-wrap items-center gap-3">
                  <span className="inline-flex rounded-full border border-saffron-300/25 bg-saffron-300/10 px-3 py-1 text-[0.62rem] font-semibold uppercase tracking-[0.24em] text-saffron-100">
                    Realtime deck map
                  </span>
                  <span className="inline-flex items-center gap-2 rounded-full border border-amber-300/20 bg-amber-300/10 px-3 py-1 text-[0.62rem] font-semibold uppercase tracking-[0.24em] text-amber-100">
                    <TimerReset size={14} strokeWidth={1.5} />
                    Hold expires in {timerLabel}
                  </span>
                </div>

                <h2 className="mt-5 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                  {title}
                </h2>
                <p className="mt-3 max-w-3xl text-sm leading-7 text-white/58 sm:text-[0.95rem]">
                  Premium top-deck selection with zone-aware seating, live seat
                  states, drag-to-pan navigation, and checkout-ready booking
                  summary.
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
                {stats.map((item) => {
                  const Icon = item.icon

                  return (
                    <div
                      key={item.label}
                      className="rounded-[20px] border border-white/8 bg-white/[0.04] px-4 py-3"
                    >
                      <div className="flex items-center gap-3">
                        <span className="grid size-9 place-items-center rounded-2xl bg-white/6 text-saffron-200">
                          <Icon size={16} strokeWidth={1.5} />
                        </span>
                        <div>
                          <p className="text-[0.62rem] font-semibold uppercase tracking-[0.22em] text-white/35">
                            {item.label}
                          </p>
                          <p className="mt-1 text-sm font-semibold text-white">
                            {item.value}
                          </p>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

          <div className="grid gap-6 px-5 py-5 sm:px-7 sm:py-7">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap gap-2">
                {[
                  { label: "Available", className: "bg-white text-slate-900 ring-white/30" },
                  {
                    label: "Selected",
                    className:
                      "bg-[linear-gradient(135deg,#9a54ff,#6f3df4)] text-white ring-purple-300/30",
                  },
                  { label: "Held", className: "bg-[#E8C56E] text-[#3D2B09] ring-[#E8C56E]/30" },
                  { label: "Sold", className: "bg-[#D6DAE0] text-[#56606C] ring-[#D6DAE0]/30" },
                ].map((item) => (
                  <span
                    key={item.label}
                    className={cn(
                      "inline-flex rounded-full px-3 py-1.5 text-[0.66rem] font-semibold uppercase tracking-[0.18em] ring-1",
                      item.className,
                    )}
                  >
                    {item.label}
                  </span>
                ))}
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => adjustZoom(-0.08)}
                  className="grid size-10 place-items-center rounded-2xl border border-white/10 bg-white/[0.04] text-white/75 transition hover:bg-white/[0.08] hover:text-white"
                  aria-label="Zoom out"
                >
                  <ZoomOut size={17} strokeWidth={1.6} />
                </button>
                <button
                  type="button"
                  onClick={resetView}
                  className="inline-flex h-10 items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.04] px-4 text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-white/70 transition hover:bg-white/[0.08] hover:text-white"
                >
                  <Move size={15} strokeWidth={1.5} />
                  Reset view
                </button>
                <button
                  type="button"
                  onClick={() => adjustZoom(0.08)}
                  className="grid size-10 place-items-center rounded-2xl border border-white/10 bg-white/[0.04] text-white/75 transition hover:bg-white/[0.08] hover:text-white"
                  aria-label="Zoom in"
                >
                  <ZoomIn size={17} strokeWidth={1.6} />
                </button>
              </div>
            </div>

            <div
              ref={viewportRef}
              className="relative overflow-hidden rounded-[30px] border border-white/8 bg-[radial-gradient(circle_at_top,rgba(12,23,46,0.9),rgba(6,7,12,1)_72%)] p-3 sm:p-5"
              onWheel={handleWheel}
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={stopDragging}
              onPointerLeave={stopDragging}
            >
              <div
                className={cn(
                  "relative transition-transform duration-300",
                  zoom > 1 && "cursor-grab",
                  isDragging && "cursor-grabbing",
                )}
                style={{
                  transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
                  transformOrigin: "center center",
                }}
              >
                <svg
                  viewBox="0 0 900 560"
                  className="h-full w-full"
                  role="img"
                  aria-label="Interactive cruise deck map"
                >
                  <defs>
                    <linearGradient id="deckHull" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#111722" />
                      <stop offset="52%" stopColor="#0C1220" />
                      <stop offset="100%" stopColor="#080C12" />
                    </linearGradient>
                    <linearGradient id="deckCore" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="rgba(255,255,255,0.10)" />
                      <stop offset="100%" stopColor="rgba(255,255,255,0.03)" />
                    </linearGradient>
                    <linearGradient id="selectedSeatGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#BA79FF" />
                      <stop offset="100%" stopColor="#6D3AF2" />
                    </linearGradient>
                    <filter id="seatGlow" x="-50%" y="-50%" width="200%" height="200%">
                      <feDropShadow dx="0" dy="10" stdDeviation="14" floodColor="rgba(0,0,0,0.35)" />
                    </filter>
                  </defs>

                  <path
                    d="M450 24C592 24 722 66 784 158L836 248C870 308 878 389 828 455C768 533 628 552 450 552C272 552 132 533 72 455C22 389 30 308 64 248L116 158C178 66 308 24 450 24Z"
                    fill="url(#deckHull)"
                    stroke="rgba(255,255,255,0.12)"
                    strokeWidth="2"
                  />
                  <path
                    d="M450 56C570 56 677 90 728 164L776 232C803 273 809 329 770 380C721 447 612 480 450 480C288 480 179 447 130 380C91 329 97 273 124 232L172 164C223 90 330 56 450 56Z"
                    fill="rgba(255,255,255,0.03)"
                    stroke="rgba(255,255,255,0.08)"
                    strokeWidth="1.5"
                  />
                  <rect
                    x="312"
                    y="84"
                    width="276"
                    height="108"
                    rx="42"
                    fill="rgba(255,255,255,0.05)"
                    stroke="rgba(255,255,255,0.08)"
                  />
                  <rect
                    x="206"
                    y="202"
                    width="488"
                    height="98"
                    rx="40"
                    fill="rgba(94,53,177,0.08)"
                    stroke="rgba(255,255,255,0.06)"
                  />
                  <rect
                    x="194"
                    y="316"
                    width="512"
                    height="58"
                    rx="29"
                    fill="rgba(255,255,255,0.04)"
                    stroke="rgba(255,255,255,0.06)"
                  />
                  <path
                    d="M316 406C354 386 404 376 450 376C496 376 546 386 584 406C546 448 497 474 450 474C403 474 354 448 316 406Z"
                    fill="rgba(232,197,110,0.10)"
                    stroke="rgba(255,255,255,0.08)"
                  />
                  <path
                    d="M450 76V468"
                    stroke="rgba(255,255,255,0.08)"
                    strokeWidth="2"
                    strokeDasharray="8 10"
                  />
                  <path
                    d="M224 262H676"
                    stroke="rgba(255,255,255,0.06)"
                    strokeWidth="2"
                    strokeDasharray="6 10"
                  />

                  <text x="450" y="98" textAnchor="middle" fill="rgba(255,255,255,0.8)" fontSize="12" letterSpacing="5">
                    SKY LOUNGE
                  </text>
                  <text x="450" y="198" textAnchor="middle" fill="rgba(255,255,255,0.52)" fontSize="12" letterSpacing="5">
                    ORCHID DECK
                  </text>
                  <text x="450" y="312" textAnchor="middle" fill="rgba(255,255,255,0.52)" fontSize="12" letterSpacing="5">
                    RIVER SALON
                  </text>
                  <text x="450" y="394" textAnchor="middle" fill="rgba(255,255,255,0.52)" fontSize="12" letterSpacing="5">
                    AFT TERRACE
                  </text>
                  <text x="450" y="46" textAnchor="middle" fill="rgba(153,225,255,0.8)" fontSize="11" letterSpacing="6">
                    BOW
                  </text>
                  <text x="450" y="535" textAnchor="middle" fill="rgba(255,255,255,0.4)" fontSize="11" letterSpacing="6">
                    STERN
                  </text>

                  {deckSeats.map((seat) => {
                    const isSelected = selected.includes(seat.id)
                    const state = isSelected ? "selected" : seat.state
                    const fill =
                      state === "selected"
                        ? "url(#selectedSeatGradient)"
                        : state === "held"
                          ? "#E8C56E"
                          : state === "sold"
                            ? "#D6DAE0"
                            : "#FFFFFF"
                    const textColor =
                      state === "available"
                        ? "#0F172A"
                        : state === "held"
                          ? "#4B390D"
                          : state === "sold"
                            ? "#5B6471"
                            : "#FFFFFF"

                    return (
                      <motion.g
                        key={seat.id}
                        whileHover={
                          state === "available"
                            ? { scale: 1.06, y: -4 }
                            : state === "selected"
                              ? { scale: 1.04 }
                              : undefined
                        }
                        transition={{ duration: 0.35, ease: motionEasings.glass }}
                        onMouseEnter={() =>
                          setHoverSeat({
                            id: seat.id,
                            label: seat.label,
                            zone: seat.zone,
                            state,
                            x: seat.x,
                            y: seat.y,
                          })
                        }
                        onMouseLeave={() => setHoverSeat(null)}
                        onClick={() => toggleSeat(seat.id, seat.state)}
                        className={cn(
                          state === "sold" || state === "held"
                            ? "cursor-not-allowed"
                            : "cursor-pointer",
                        )}
                        filter="url(#seatGlow)"
                      >
                        <rect
                          x={seat.x - 28}
                          y={seat.y - 20}
                          width="56"
                          height="40"
                          rx="16"
                          fill={fill}
                          stroke={state === "selected" ? "rgba(255,255,255,0.16)" : "rgba(15,23,42,0.08)"}
                        />
                        <text
                          x={seat.x}
                          y={seat.y + 4}
                          textAnchor="middle"
                          fill={textColor}
                          fontSize="12"
                          fontWeight="700"
                          letterSpacing="1"
                        >
                          {seat.id}
                        </text>
                      </motion.g>
                    )
                  })}
                </svg>
              </div>

              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[#07080c] to-transparent" />

              {hoverSeat ? (
                <div
                  className="pointer-events-none absolute rounded-2xl border border-white/10 bg-stone-950/88 px-4 py-3 text-sm text-white shadow-[0_20px_50px_rgba(0,0,0,0.35)] backdrop-blur-xl"
                  style={{
                    left: `calc(${(hoverSeat.x / 900) * 100}% - 64px)`,
                    top: `calc(${(hoverSeat.y / 560) * 100}% - 74px)`,
                  }}
                >
                  <p className="font-semibold text-white">{hoverSeat.id}</p>
                  <p className="mt-1 text-xs uppercase tracking-[0.18em] text-white/40">
                    {hoverSeat.zone}
                  </p>
                  <p className="mt-2 text-xs text-white/65">
                    {hoverSeat.state === "selected"
                      ? "Added to your booking"
                      : hoverSeat.state === "held"
                        ? "Temporarily on hold"
                        : hoverSeat.state === "sold"
                          ? "Already sold"
                          : "Available for selection"}
                  </p>
                </div>
              ) : null}
            </div>

            <div className="grid gap-4 lg:grid-cols-[1fr_1fr]">
              <div className="rounded-[24px] border border-white/8 bg-white/[0.04] p-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-white/35">
                      Deck notes
                    </p>
                    <h3 className="mt-3 text-lg font-semibold text-white">
                      Premium seating zones
                    </h3>
                  </div>
                  <Crown className="text-[#E8C56E]" size={18} strokeWidth={1.6} />
                </div>
                <div className="mt-4 grid gap-3 text-sm text-white/60">
                  <div className="rounded-2xl border border-white/6 bg-white/[0.03] px-4 py-3">
                    Sky Lounge offers the cleanest river view with the most open bow sightline.
                  </div>
                  <div className="rounded-2xl border border-white/6 bg-white/[0.03] px-4 py-3">
                    Orchid Deck balances ceremony views and lounge proximity for small parties.
                  </div>
                  <div className="rounded-2xl border border-white/6 bg-white/[0.03] px-4 py-3">
                    Aft Terrace remains best for couples wanting a quieter stern edge.
                  </div>
                </div>
              </div>

              <div className="rounded-[24px] border border-white/8 bg-white/[0.04] p-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-white/35">
                      Booking feel
                    </p>
                    <h3 className="mt-3 text-lg font-semibold text-white">
                      Transaction-safe flow
                    </h3>
                  </div>
                  <Info className="text-saffron-200" size={18} strokeWidth={1.6} />
                </div>
                <div className="mt-4 grid gap-3 text-sm text-white/60">
                  <div className="flex items-center justify-between rounded-2xl border border-white/6 bg-white/[0.03] px-4 py-3">
                    <span>Selected seats</span>
                    <span className="font-semibold text-white">{selected.length}</span>
                  </div>
                  <div className="flex items-center justify-between rounded-2xl border border-white/6 bg-white/[0.03] px-4 py-3">
                    <span>Locked by operations</span>
                    <span className="font-semibold text-white">{lockedSeats.length}</span>
                  </div>
                  <div className="flex items-center justify-between rounded-2xl border border-white/6 bg-white/[0.03] px-4 py-3">
                    <span>Sold inventory</span>
                    <span className="font-semibold text-white">{soldSeats.length}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      <aside className="xl:sticky xl:top-24 xl:self-start">
        <div className="overflow-hidden rounded-[32px] border border-white/10 bg-[linear-gradient(180deg,rgba(14,16,23,0.98),rgba(7,8,12,0.98))] shadow-[0_40px_120px_rgba(0,0,0,0.45)]">
          <div className="border-b border-white/8 px-6 py-6">
            <div className="flex items-center gap-3 text-saffron-200">
              <ShieldCheck strokeWidth={1.5} />
              <span className="text-[0.72rem] font-semibold uppercase tracking-[0.22em]">
                Secure booking summary
              </span>
            </div>
            <h3 className="mt-4 text-3xl font-semibold tracking-tight text-white">
              Complete your deck hold
            </h3>
          </div>

          <div className="grid gap-6 px-6 py-6">
            <div className="grid gap-3 text-sm text-white/65">
              <div className="flex items-center justify-between rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-3">
                <span>Route</span>
                <span className="font-semibold text-white">{location}</span>
              </div>
              <div className="flex items-center justify-between rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-3">
                <span>Departure</span>
                <span className="font-semibold text-white">{date}</span>
              </div>
              <div className="flex items-center justify-between rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-3">
                <span>Travelers</span>
                <span className="font-semibold text-white">{initialGuests}</span>
              </div>
            </div>

            <div>
              <p className="text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-white/35">
                Selected seats
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {selected.length > 0 ? (
                  selected.map((seatId) => (
                    <span
                      key={seatId}
                      className="rounded-full bg-[linear-gradient(135deg,#B874FF,#6E3DF5)] px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-white shadow-[0_14px_34px_rgba(111,61,244,0.35)]"
                    >
                      {seatId}
                    </span>
                  ))
                ) : (
                  <span className="rounded-full border border-white/10 px-3 py-1.5 text-xs uppercase tracking-[0.18em] text-white/40">
                    Select seats on the deck
                  </span>
                )}
              </div>
            </div>

            <div className="grid gap-3 rounded-[24px] border border-white/8 bg-white/[0.03] p-4 text-sm text-white/60">
              <div className="flex justify-between">
                <span>{selected.length} seats</span>
                <span className="font-semibold text-white">{formatPrice(selectedTotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>Taxes and service</span>
                <span className="font-semibold text-white">{formatPrice(tax)}</span>
              </div>
              <div className="border-t border-white/8 pt-3">
                <div className="flex justify-between text-base">
                  <span className="font-medium text-white">Total due</span>
                  <span className="font-semibold text-white">{formatPrice(total)}</span>
                </div>
              </div>
            </div>

            <div className="grid gap-3">
              <input
                value={guest.name}
                onChange={(event) => updateGuest("name", event.target.value)}
                placeholder="Guest name"
                className="h-12 rounded-2xl border border-white/10 bg-white/[0.04] px-4 text-sm text-white outline-none transition placeholder:text-white/32 focus:border-saffron-300/35"
              />
              <input
                value={guest.email}
                onChange={(event) => updateGuest("email", event.target.value)}
                placeholder="Email address"
                type="email"
                className="h-12 rounded-2xl border border-white/10 bg-white/[0.04] px-4 text-sm text-white outline-none transition placeholder:text-white/32 focus:border-saffron-300/35"
              />
              <input
                value={guest.phone}
                onChange={(event) => updateGuest("phone", event.target.value)}
                placeholder="WhatsApp number"
                className="h-12 rounded-2xl border border-white/10 bg-white/[0.04] px-4 text-sm text-white outline-none transition placeholder:text-white/32 focus:border-saffron-300/35"
              />
            </div>

            <Button
              className="h-14 rounded-[20px] bg-[linear-gradient(135deg,#5FE1FF,#35C5ED)] text-slate-950 shadow-[0_20px_48px_rgba(53,197,237,0.28)] hover:brightness-105"
              disabled={!canContinue}
              onClick={continueToPayment}
            >
              Continue to payment
              <ArrowRight data-icon="inline-end" strokeWidth={1.5} />
            </Button>

            <p className="text-xs leading-6 text-white/38">
              Seats are held temporarily in this MVP. Production should use the
              Supabase seat-hold RPC and expiry cleanup path.
            </p>
          </div>
        </div>
      </aside>
    </div>
  )
}
