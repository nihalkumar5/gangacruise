"use client"

import { useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowRight, CreditCard, ShieldCheck } from "lucide-react"

import { GlassPanel } from "@/components/luxury/glass-panel"
import { StatusBadge } from "@/components/shared/status-badge"
import { Button } from "@/components/ui/button"
import { formatPrice } from "@/lib/data/cruises"

import {
  type BookingSnapshot,
  readBookingSnapshot,
  saveAdminBooking,
  saveBookingSnapshot,
} from "../lib/booking-state"

type CheckoutClientProps = {
  bookingId: string
  orderId: string
  defaultSeatCount: number
}

export function CheckoutClient({
  bookingId,
  orderId,
  defaultSeatCount,
}: CheckoutClientProps) {
  const router = useRouter()
  const [booking, setBooking] = useState<BookingSnapshot | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const snapshot = readBookingSnapshot()

    if (snapshot?.id === bookingId) {
      setBooking(snapshot)
    }
  }, [bookingId])

  const fallbackTotal = defaultSeatCount * 4200
  const total = booking?.total ?? Math.round(fallbackTotal * 1.05)
  const seats = booking?.seats ?? Array.from({ length: defaultSeatCount }, (_, index) => `S0${index + 1}`)

  const trustSteps = useMemo(
    () => [
      "Server-side order creation",
      "Webhook signature verification",
      "Idempotent booking confirmation",
      "QR ticket after verified capture",
    ],
    [],
  )

  function simulatePayment() {
    setLoading(true)

    window.setTimeout(() => {
      const confirmed: BookingSnapshot = {
        id: bookingId,
        sailingId: booking?.sailingId ?? "sailing_aarti_today",
        cruiseTitle: booking?.cruiseTitle ?? "Evening Aarti Reserve",
        location: booking?.location ?? "Varanasi",
        date: booking?.date ?? "2026-05-13",
        guests: booking?.guests ?? seats.length,
        seats,
        subtotal: booking?.subtotal ?? fallbackTotal,
        tax: booking?.tax ?? Math.round(fallbackTotal * 0.05),
        total,
        guest: booking?.guest ?? {
          name: "Guest",
          email: "guest@example.com",
          phone: "+91 99999 99999",
        },
        status: "confirmed",
      }

      saveBookingSnapshot(confirmed)
      saveAdminBooking(confirmed)
      router.push(`/ticket/${bookingId}`, { scroll: false })
    }, 850)
  }

  return (
    <div className="luxury-shell grid gap-5 lg:grid-cols-[1fr_24rem]">
      <GlassPanel innerClassName="p-8">
        <div className="flex items-center gap-3 text-gold-100">
          <CreditCard strokeWidth={1.4} />
          <span className="text-xs uppercase tracking-[0.22em]">
            Razorpay checkout
          </span>
        </div>
        <h2 className="mt-5 font-display text-5xl text-river">Payment ready</h2>
        <p className="mt-5 max-w-2xl leading-8 text-river/62">
          Order <span className="text-gold-100">{orderId}</span> is created in
          mocked mode. Production swaps this action for Razorpay Checkout and
          verifies the capture through a signed webhook before confirming seats.
        </p>

        <div className="mt-8 grid gap-3 rounded-[1.5rem] border border-stone-200 bg-white/70 p-5 text-sm text-river/68 sm:grid-cols-3">
          <div>
            <p className="text-xs uppercase tracking-[0.22em] text-river/38">Guest</p>
            <p className="mt-2 text-river">{booking?.guest.name ?? "Guest"}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.22em] text-river/38">Seats</p>
            <p className="mt-2 text-river">{seats.join(", ")}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.22em] text-river/38">Total</p>
            <p className="mt-2 text-river">{formatPrice(total)}</p>
          </div>
        </div>

        <Button className="mt-8 h-14" disabled={loading} onClick={simulatePayment}>
          {loading ? "Verifying payment..." : "Simulate verified payment"}
          <ArrowRight data-icon="inline-end" strokeWidth={1.4} />
        </Button>
      </GlassPanel>

      <GlassPanel innerClassName="p-7">
        <ShieldCheck className="text-gold-100" strokeWidth={1.4} />
        <h3 className="mt-5 font-display text-4xl text-river">Trust path</h3>
        <div className="mt-6 grid gap-3">
          {trustSteps.map((step) => (
            <StatusBadge key={step} tone="muted">
              {step}
            </StatusBadge>
          ))}
        </div>
      </GlassPanel>
    </div>
  )
}
