"use client"

import Link from "next/link"
import { useEffect, useMemo, useState } from "react"
import { CalendarDays, TicketCheck, WalletCards } from "lucide-react"

import { GlassPanel } from "@/components/luxury/glass-panel"
import { StatusBadge } from "@/components/shared/status-badge"
import { Button } from "@/components/ui/button"
import {
  type AdminBookingRecord,
  readAdminBookings,
  readBookingSnapshot,
} from "@/features/booking/lib/booking-state"
import { formatPrice } from "@/lib/data/cruises"

type GuestDashboardProps = {
  email: string
}

export function GuestDashboard({ email }: GuestDashboardProps) {
  const [bookings, setBookings] = useState<AdminBookingRecord[]>([])

  useEffect(() => {
    function sync() {
      const normalizedEmail = email.toLowerCase()
      const adminBookings = readAdminBookings()
      const lastBooking = readBookingSnapshot()
      const merged = [
        ...adminBookings,
        ...(lastBooking
          ? [
              {
                ...lastBooking,
                confirmedAt: new Date().toISOString(),
              } satisfies AdminBookingRecord,
            ]
          : []),
      ]
      const filtered = merged.filter(
        (booking, index, list) =>
          booking.guest.email.toLowerCase() === normalizedEmail &&
          list.findIndex((item) => item.id === booking.id) === index,
      )

      setBookings(filtered)
    }

    sync()
    window.addEventListener("storage", sync)
    window.addEventListener("focus", sync)

    return () => {
      window.removeEventListener("storage", sync)
      window.removeEventListener("focus", sync)
    }
  }, [email])

  const totalSpend = useMemo(
    () => bookings.reduce((sum, booking) => sum + booking.total, 0),
    [bookings],
  )
  const totalSeats = useMemo(
    () => bookings.reduce((sum, booking) => sum + booking.seats.length, 0),
    [bookings],
  )

  return (
    <div className="luxury-shell grid gap-5">
      <div className="grid gap-4 md:grid-cols-3">
        <GlassPanel innerClassName="p-6">
          <TicketCheck className="text-lotus" strokeWidth={1.4} />
          <p className="mt-6 text-sm uppercase tracking-[0.18em] text-river/45">
            Bookings
          </p>
          <p className="mt-3 font-display text-5xl text-river">{bookings.length}</p>
        </GlassPanel>
        <GlassPanel innerClassName="p-6">
          <CalendarDays className="text-lotus" strokeWidth={1.4} />
          <p className="mt-6 text-sm uppercase tracking-[0.18em] text-river/45">
            Seats
          </p>
          <p className="mt-3 font-display text-5xl text-river">{totalSeats}</p>
        </GlassPanel>
        <GlassPanel innerClassName="p-6">
          <WalletCards className="text-lotus" strokeWidth={1.4} />
          <p className="mt-6 text-sm uppercase tracking-[0.18em] text-river/45">
            Paid
          </p>
          <p className="mt-3 font-display text-5xl text-river">
            {formatPrice(totalSpend)}
          </p>
        </GlassPanel>
      </div>

      <GlassPanel innerClassName="p-6 sm:p-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <StatusBadge>Booking history</StatusBadge>
            <h2 className="mt-4 font-display text-5xl text-river">
              Your river tickets
            </h2>
          </div>
          <Button asChild variant="ghost">
            <Link href="/booking">Book again</Link>
          </Button>
        </div>

        <div className="mt-8 overflow-hidden rounded-[1.5rem] border border-stone-200">
          {bookings.map((booking) => (
            <div
              key={booking.id}
              className="grid gap-4 border-b border-stone-200 bg-white/70 p-5 text-sm text-river/64 last:border-b-0 lg:grid-cols-[1.2fr_1fr_0.8fr_auto]"
            >
              <span>
                <span className="block font-semibold text-river">
                  {booking.cruiseTitle}
                </span>
                <span className="mt-1 block text-xs text-river/45">
                  {booking.location} · {booking.date}
                </span>
              </span>
              <span>
                <span className="block text-river">{booking.seats.join(", ")}</span>
                <span className="mt-1 block text-xs text-river/45">
                  {booking.guests} guests
                </span>
              </span>
              <span className="font-semibold text-lotus">
                {formatPrice(booking.total)}
              </span>
              <Button asChild size="sm">
                <Link href={`/ticket/${booking.id}`}>Open ticket</Link>
              </Button>
            </div>
          ))}

          {bookings.length === 0 ? (
            <div className="bg-white/70 p-8 text-sm leading-7 text-river/58">
              No bookings found for {email}. Use the same email during checkout,
              then return here to view tickets.
            </div>
          ) : null}
        </div>
      </GlassPanel>
    </div>
  )
}
