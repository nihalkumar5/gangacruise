"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { CalendarClock, Download, Mail, MessageCircle } from "lucide-react"

import { GlassPanel } from "@/components/luxury/glass-panel"
import { StatusBadge } from "@/components/shared/status-badge"
import { Button } from "@/components/ui/button"
import { formatPrice } from "@/lib/data/cruises"

import { type BookingSnapshot, readBookingSnapshot } from "../lib/booking-state"

type TicketClientProps = {
  token: string
}

export function TicketClient({ token }: TicketClientProps) {
  const [booking, setBooking] = useState<BookingSnapshot | null>(null)

  useEffect(() => {
    const snapshot = readBookingSnapshot()

    if (snapshot?.id === token) {
      setBooking(snapshot)
    }
  }, [token])

  const seats = booking?.seats ?? ["S01", "S02"]

  return (
    <div className="luxury-shell grid gap-5 lg:grid-cols-[22rem_1fr]">
      <GlassPanel innerClassName="grid place-items-center p-8">
        <div className="grid size-56 grid-cols-7 gap-1 rounded-[1.5rem] bg-river p-5">
          {Array.from({ length: 49 }, (_, index) => (
            <span
              key={index}
              className={
                (index * 7 + token.length + seats.length) % 5 < 2
                  ? "rounded-sm bg-obsidian"
                  : "rounded-sm bg-transparent"
              }
            />
          ))}
        </div>
      </GlassPanel>

      <GlassPanel innerClassName="p-8">
        <StatusBadge tone="success">Confirmed</StatusBadge>
        <h2 className="mt-5 break-words font-display text-5xl text-river">
          GC-{token.replace("booking_", "")}
        </h2>
        <p className="mt-5 max-w-2xl leading-8 text-river/62">
          Show this QR at boarding. Passenger manifest, seat assignment,
          payment receipt, and reminder emails are wired through the provider
          adapter layer.
        </p>

        <div className="mt-8 grid gap-3 md:grid-cols-3">
          <div className="rounded-[1.25rem] border border-stone-200 bg-white/70 p-4">
            <p className="text-xs uppercase tracking-[0.22em] text-river/40">Guest</p>
            <p className="mt-2 text-sm text-river">{booking?.guest.name ?? "Guest"}</p>
          </div>
          <div className="rounded-[1.25rem] border border-stone-200 bg-white/70 p-4">
            <p className="text-xs uppercase tracking-[0.22em] text-river/40">Seats</p>
            <p className="mt-2 text-sm text-river">{seats.join(", ")}</p>
          </div>
          <div className="rounded-[1.25rem] border border-stone-200 bg-white/70 p-4">
            <p className="text-xs uppercase tracking-[0.22em] text-river/40">Paid</p>
            <p className="mt-2 text-sm text-river">{formatPrice(booking?.total ?? 8820)}</p>
          </div>
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <Button variant="ghost">
            <Download strokeWidth={1.4} />
            Ticket PDF
          </Button>
          <Button variant="ghost">
            <Mail strokeWidth={1.4} />
            Email sent
          </Button>
          <Button variant="ghost">
            <MessageCircle strokeWidth={1.4} />
            WhatsApp ready
          </Button>
          <Button asChild variant="outline">
            <Link href="/booking">
              <CalendarClock strokeWidth={1.4} />
              Book another
            </Link>
          </Button>
        </div>
      </GlassPanel>
    </div>
  )
}
