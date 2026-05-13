"use client"

import Link from "next/link"
import { useEffect, useMemo, useState } from "react"
import {
  Activity,
  BarChart3,
  CircleDollarSign,
  Download,
  Lock,
  LockOpen,
  MessageCircle,
  RefreshCw,
  Search,
  Ship,
  TicketCheck,
  Trash2,
} from "lucide-react"

import { StatusBadge } from "@/components/shared/status-badge"
import { Button } from "@/components/ui/button"
import {
  type AdminBookingRecord,
  type AdminSeatLockRecord,
  clearAdminBookings,
  readAdminBookings,
  readAdminSeatLocks,
  removeAdminSeatLock,
  saveAdminSeatLock,
  writeAdminSeatLocks,
  writeAdminBookings,
} from "@/features/booking/lib/booking-state"
import { cruises, formatPrice, sailings } from "@/lib/data/cruises"
import { cn } from "@/lib/utils"

const fallbackBookings: AdminBookingRecord[] = [
  {
    id: "GC-ARTI-S01-S02",
    sailingId: "sailing_aarti_today",
    cruiseTitle: "Evening Aarti Reserve",
    location: "Varanasi",
    date: "2026-05-13",
    guests: 2,
    seats: ["S01", "S02"],
    subtotal: 8400,
    tax: 420,
    total: 8820,
    guest: {
      name: "Aarav Mehta",
      email: "aarav@example.com",
      phone: "+91 98765 43210",
    },
    status: "confirmed",
    confirmedAt: "2026-05-12T05:20:00.000Z",
  },
]

const demoBookings: AdminBookingRecord[] = [
  ...fallbackBookings,
  {
    id: "GC-DAWN-S06-S09-S10",
    sailingId: "sailing_dawn_today",
    cruiseTitle: "Dawn on the Ghats",
    location: "Assi Ghat",
    date: "2026-05-13",
    guests: 3,
    seats: ["S06", "S09", "S10"],
    subtotal: 8400,
    tax: 420,
    total: 8820,
    guest: {
      name: "Nihal Kumar",
      email: "nihal@example.com",
      phone: "+91 98765 43210",
    },
    status: "confirmed",
    confirmedAt: "2026-05-12T06:08:00.000Z",
  },
]

type AdminView = "bookings" | "inventory" | "locks" | "operations"

export function AdminDashboard() {
  const [storedBookings, setStoredBookings] = useState<AdminBookingRecord[]>([])
  const [seatLocks, setSeatLocks] = useState<AdminSeatLockRecord[]>([])
  const [query, setQuery] = useState("")
  const [activeView, setActiveView] = useState<AdminView>("bookings")
  const [lockForm, setLockForm] = useState({
    sailingId: "sailing_aarti_today",
    seats: "S11,S12",
    guestName: "",
    phone: "",
    notes: "",
  })

  function syncBookings() {
    setStoredBookings(readAdminBookings())
    setSeatLocks(readAdminSeatLocks())
  }

  useEffect(() => {
    syncBookings()
    window.addEventListener("storage", syncBookings)
    window.addEventListener("focus", syncBookings)

    return () => {
      window.removeEventListener("storage", syncBookings)
      window.removeEventListener("focus", syncBookings)
    }
  }, [])

  const bookings = storedBookings.length > 0 ? storedBookings : fallbackBookings
  const filteredBookings = useMemo(() => {
    const normalized = query.trim().toLowerCase()

    if (!normalized) {
      return bookings
    }

    return bookings.filter((booking) =>
      [
        booking.id,
        booking.cruiseTitle,
        booking.location,
        booking.date,
        booking.guest.name,
        booking.guest.email,
        booking.guest.phone,
        booking.seats.join(" "),
      ]
        .join(" ")
        .toLowerCase()
        .includes(normalized),
    )
  }, [bookings, query])

  const filteredLocks = useMemo(() => {
    const normalized = query.trim().toLowerCase()

    if (!normalized) {
      return seatLocks
    }

    return seatLocks.filter((lock) =>
      [
        lock.sailingId,
        lock.guestName,
        lock.phone,
        lock.notes,
        lock.seats.join(" "),
      ]
        .join(" ")
        .toLowerCase()
        .includes(normalized),
    )
  }, [query, seatLocks])

  const metrics = useMemo(() => {
    const revenue = bookings.reduce((sum, booking) => sum + booking.total, 0)
    const seatsBooked = bookings.reduce(
      (sum, booking) => sum + booking.seats.length,
      0,
    )
    return [
      {
        label: "Revenue",
        value: formatPrice(revenue),
        icon: CircleDollarSign,
        tone: "success" as const,
      },
      {
        label: "Bookings",
        value: String(bookings.length),
        icon: TicketCheck,
        tone: "gold" as const,
      },
      {
        label: "Seats locked",
        value: String(seatLocks.reduce((sum, lock) => sum + lock.seats.length, 0)),
        icon: Lock,
        tone: "muted" as const,
      },
      {
        label: "Seats booked",
        value: String(seatsBooked),
        icon: BarChart3,
        tone: "success" as const,
      },
    ]
  }, [bookings, seatLocks])

  const inventory = useMemo(
    () =>
      sailings.map((sailing) => {
        const cruise = cruises.find((item) => item.slug === sailing.cruiseSlug)
        const bookedSeats = bookings
          .filter((booking) => booking.sailingId === sailing.id)
          .reduce((sum, booking) => sum + booking.seats.length, 0)
        const lockedSeats = seatLocks
          .filter((lock) => lock.sailingId === sailing.id)
          .reduce((sum, lock) => sum + lock.seats.length, 0)
        const capacity = cruise?.capacity ?? 32
        const occupancy = Math.min(
          Math.round(((bookedSeats + lockedSeats) / capacity) * 100),
          100,
        )

        return {
          sailing,
          cruise,
          bookedSeats,
          lockedSeats,
          capacity,
          occupancy,
        }
      }),
    [bookings, seatLocks],
  )

  function seedDemoBookings() {
    writeAdminBookings(demoBookings)
    syncBookings()
  }

  function updateLockForm(
    field: keyof typeof lockForm,
    value: string,
  ) {
    setLockForm((current) => ({ ...current, [field]: value }))
  }

  function saveWhatsappLock() {
    const seatsToLock = lockForm.seats
      .split(",")
      .map((seat) => seat.trim().toUpperCase())
      .filter(Boolean)

    if (
      !lockForm.guestName.trim() ||
      !lockForm.phone.trim() ||
      seatsToLock.length === 0
    ) {
      return
    }

    saveAdminSeatLock({
      sailingId: lockForm.sailingId,
      seats: seatsToLock,
      guestName: lockForm.guestName.trim(),
      phone: lockForm.phone.trim(),
      source: "whatsapp",
      notes: lockForm.notes.trim(),
    })

    setLockForm((current) => ({
      ...current,
      seats: "",
      guestName: "",
      phone: "",
      notes: "",
    }))
    syncBookings()
  }

  function clearBookings() {
    clearAdminBookings()
    syncBookings()
  }

  function clearLocks() {
    writeAdminSeatLocks([])
    syncBookings()
  }

  function exportBookings() {
    const blob = new Blob([JSON.stringify(bookings, null, 2)], {
      type: "application/json",
    })
    const url = window.URL.createObjectURL(blob)
    const anchor = document.createElement("a")
    anchor.href = url
    anchor.download = "ganga-cruise-bookings.json"
    anchor.click()
    window.URL.revokeObjectURL(url)
  }

  const activeTabMeta: Record<AdminView, { label: string; copy: string }> = {
    bookings: {
      label: "Bookings",
      copy: "Track incoming reservations, guest details, ticket access, and collected revenue.",
    },
    inventory: {
      label: "Inventory",
      copy: "Keep sailing capacity, occupancy, and live availability aligned across departures.",
    },
    locks: {
      label: "Seat Locks",
      copy: "Manage temporary WhatsApp holds before payment confirmation or release.",
    },
    operations: {
      label: "Operations",
      copy: "Monitor sync health, export readiness, and live workflow reliability.",
    },
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[260px_minmax(0,1fr)]">
      <aside className="rounded-[28px] border border-slate-200 bg-white p-4 shadow-[0_24px_70px_rgba(15,23,42,0.06)]">
        <div className="rounded-[22px] bg-slate-950 px-4 py-5 text-white">
          <p className="text-[0.68rem] font-semibold uppercase tracking-[0.26em] text-slate-300">
            Workspace
          </p>
          <h2 className="mt-3 text-lg font-semibold tracking-tight">
            River control center
          </h2>
          <p className="mt-2 text-sm leading-6 text-slate-300">
            Switch between bookings, inventory, holds, and operating notes
            without leaving the admin flow.
          </p>
        </div>

        <nav className="mt-4 grid gap-2">
          {(["bookings", "inventory", "locks", "operations"] as AdminView[]).map(
            (view) => {
              const isActive = activeView === view

              return (
                <button
                  key={view}
                  type="button"
                  onClick={() => setActiveView(view)}
                  className={cn(
                    "rounded-[20px] border px-4 py-3 text-left transition",
                    isActive
                      ? "border-slate-900 bg-slate-900 text-white shadow-[0_18px_30px_rgba(15,23,42,0.18)]"
                      : "border-slate-200 bg-slate-50 text-slate-600 hover:border-slate-300 hover:bg-white hover:text-slate-900",
                  )}
                >
                  <span className="block text-sm font-semibold capitalize">
                    {activeTabMeta[view].label}
                  </span>
                  <span
                    className={cn(
                      "mt-1 block text-xs leading-5",
                      isActive ? "text-slate-300" : "text-slate-500",
                    )}
                  >
                    {activeTabMeta[view].copy}
                  </span>
                </button>
              )
            },
          )}
        </nav>

        <div className="mt-4 rounded-[22px] border border-slate-200 bg-slate-50 p-4">
          <p className="text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-slate-500">
            Quick actions
          </p>
          <div className="mt-3 grid gap-2">
            <Button
              variant="ghost"
              size="sm"
              className="h-10 justify-start rounded-xl bg-white text-slate-700 ring-1 ring-slate-200 hover:bg-slate-100"
              onClick={syncBookings}
            >
              <RefreshCw strokeWidth={1.4} />
              Refresh state
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-10 justify-start rounded-xl bg-white text-slate-700 ring-1 ring-slate-200 hover:bg-slate-100"
              onClick={seedDemoBookings}
            >
              <Ship strokeWidth={1.4} />
              Seed demo data
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-10 justify-start rounded-xl bg-white text-slate-700 ring-1 ring-slate-200 hover:bg-slate-100"
              onClick={exportBookings}
            >
              <Download strokeWidth={1.4} />
              Export JSON
            </Button>
          </div>
        </div>
      </aside>

      <div className="grid gap-6">
        <section className="grid gap-4 md:grid-cols-2 2xl:grid-cols-4">
          {metrics.map((metric) => {
            const Icon = metric.icon

            return (
              <div
                key={metric.label}
                className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-[0_16px_50px_rgba(15,23,42,0.05)]"
              >
                <div className="flex items-center justify-between">
                  <StatusBadge tone={metric.tone}>{metric.label}</StatusBadge>
                  <span className="grid size-10 place-items-center rounded-2xl bg-slate-100 text-slate-600">
                    <Icon strokeWidth={1.5} size={18} />
                  </span>
                </div>
                <p className="mt-6 text-3xl font-semibold tracking-tight text-slate-950">
                  {metric.value}
                </p>
                <p className="mt-2 text-sm text-slate-500">
                  {metric.label === "Revenue" && "Confirmed gross across local admin records."}
                  {metric.label === "Bookings" && "Total confirmed reservations visible in the workspace."}
                  {metric.label === "Seats locked" && "Temporary holds pending release or payment conversion."}
                  {metric.label === "Seats booked" && "Net seats allocated across active sailings."}
                </p>
              </div>
            )
          })}
        </section>

        <section className="rounded-[28px] border border-slate-200 bg-white shadow-[0_24px_70px_rgba(15,23,42,0.06)]">
          <div className="flex flex-col gap-5 border-b border-slate-200 px-5 py-5 sm:px-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <div className="flex flex-wrap items-center gap-3">
                  <StatusBadge tone="muted">Admin workspace</StatusBadge>
                  <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1.5 text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-emerald-700 ring-1 ring-emerald-200">
                    <Activity size={14} strokeWidth={1.5} />
                    Connected
                  </div>
                </div>
                <h2 className="mt-4 text-2xl font-semibold tracking-tight text-slate-950">
                  {activeTabMeta[activeView].label}
                </h2>
                <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">
                  {activeTabMeta[activeView].copy}
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-10 rounded-xl bg-slate-950 px-4 text-white hover:bg-slate-800"
                  onClick={syncBookings}
                >
                  <RefreshCw strokeWidth={1.4} />
                  Refresh
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-10 rounded-xl border-slate-300 bg-white px-4 text-slate-700 hover:bg-slate-50"
                  onClick={clearBookings}
                >
                  <Trash2 strokeWidth={1.4} />
                  Clear local
                </Button>
              </div>
            </div>

            <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_auto]">
              <label className="flex items-center gap-3 rounded-[18px] border border-slate-200 bg-slate-50 px-4 py-3">
                <Search className="text-slate-400" strokeWidth={1.6} />
                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search guest, booking ID, cruise, sailing, seat, or phone"
                  className="w-full bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
                />
              </label>
              <div className="grid grid-cols-2 gap-3 sm:flex">
                <div className="rounded-[18px] border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
                  <span className="block text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-slate-400">
                    Active bookings
                  </span>
                  <span className="mt-1 block font-semibold text-slate-900">
                    {bookings.length}
                  </span>
                </div>
                <div className="rounded-[18px] border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
                  <span className="block text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-slate-400">
                    Active holds
                  </span>
                  <span className="mt-1 block font-semibold text-slate-900">
                    {seatLocks.length}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="p-5 sm:p-6">
            {activeView === "bookings" ? (
              <div className="overflow-hidden rounded-[22px] border border-slate-200">
                <div className="hidden grid-cols-[1.25fr_1fr_0.8fr_0.7fr_auto] gap-4 bg-slate-50 px-5 py-3 text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-slate-500 xl:grid">
                  <span>Guest</span>
                  <span>Sailing</span>
                  <span>Seats</span>
                  <span>Total</span>
                  <span className="text-right">Actions</span>
                </div>

                {filteredBookings.map((booking) => (
                  <div
                    key={booking.id}
                    className="grid gap-4 border-t border-slate-200 bg-white px-5 py-5 text-sm first:border-t-0 xl:grid-cols-[1.25fr_1fr_0.8fr_0.7fr_auto] xl:items-center"
                  >
                    <div>
                      <p className="font-semibold text-slate-950">
                        {booking.guest.name}
                      </p>
                      <p className="mt-1 text-xs text-slate-500">
                        {booking.guest.email} · {booking.guest.phone}
                      </p>
                      <p className="mt-2 text-xs font-medium uppercase tracking-[0.14em] text-slate-400 xl:hidden">
                        {booking.id}
                      </p>
                    </div>

                    <div>
                      <p className="font-medium text-slate-900">
                        {booking.cruiseTitle}
                      </p>
                      <p className="mt-1 text-xs text-slate-500">
                        {booking.location} · {booking.date}
                      </p>
                    </div>

                    <div>
                      <p className="font-medium text-slate-900">
                        {booking.seats.join(", ")}
                      </p>
                      <p className="mt-1 text-xs text-slate-500">
                        {booking.guests} guests
                      </p>
                    </div>

                    <div>
                      <p className="font-semibold text-slate-950">
                        {formatPrice(booking.total)}
                      </p>
                      <p className="mt-1 text-xs text-slate-500">
                        Ticket {booking.id}
                      </p>
                    </div>

                    <div className="flex justify-start xl:justify-end">
                      <Button
                        asChild
                        variant="ghost"
                        size="sm"
                        className="h-10 rounded-xl bg-slate-50 px-4 text-slate-700 ring-1 ring-slate-200 hover:bg-slate-100"
                      >
                        <Link href={`/ticket/${booking.id}`}>Open ticket</Link>
                      </Button>
                    </div>
                  </div>
                ))}

                {filteredBookings.length === 0 ? (
                  <div className="bg-white px-6 py-10 text-sm text-slate-500">
                    No bookings match that search yet.
                  </div>
                ) : null}
              </div>
            ) : null}

            {activeView === "inventory" ? (
              <div className="grid gap-4 lg:grid-cols-2 2xl:grid-cols-3">
                {inventory.map((item) => (
                  <div
                    key={item.sailing.id}
                    className="rounded-[22px] border border-slate-200 bg-slate-50 p-5"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-slate-400">
                          {item.sailing.label}
                        </p>
                        <h3 className="mt-3 text-xl font-semibold tracking-tight text-slate-950">
                          {item.cruise?.title}
                        </h3>
                      </div>
                      <StatusBadge tone={item.occupancy > 74 ? "danger" : "success"}>
                        {item.occupancy > 74 ? "High load" : "Healthy"}
                      </StatusBadge>
                    </div>

                    <div className="mt-5 grid grid-cols-3 gap-3">
                      <div className="rounded-2xl bg-white px-3 py-3">
                        <p className="text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-slate-400">
                          Booked
                        </p>
                        <p className="mt-1 text-lg font-semibold text-slate-950">
                          {item.bookedSeats}
                        </p>
                      </div>
                      <div className="rounded-2xl bg-white px-3 py-3">
                        <p className="text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-slate-400">
                          Locked
                        </p>
                        <p className="mt-1 text-lg font-semibold text-slate-950">
                          {item.lockedSeats}
                        </p>
                      </div>
                      <div className="rounded-2xl bg-white px-3 py-3">
                        <p className="text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-slate-400">
                          Public left
                        </p>
                        <p className="mt-1 text-lg font-semibold text-slate-950">
                          {item.sailing.seatsLeft}
                        </p>
                      </div>
                    </div>

                    <div className="mt-5 h-2.5 overflow-hidden rounded-full bg-slate-200">
                      <div
                        className="h-full rounded-full bg-slate-950"
                        style={{ width: `${item.occupancy}%` }}
                      />
                    </div>
                    <p className="mt-3 text-sm text-slate-500">
                      {item.occupancy}% occupancy across {item.capacity} seats.
                    </p>
                  </div>
                ))}
              </div>
            ) : null}

            {activeView === "locks" ? (
              <div className="grid gap-5 xl:grid-cols-[360px_minmax(0,1fr)]">
                <div className="rounded-[22px] border border-slate-200 bg-slate-50 p-5">
                  <div className="flex items-center gap-3 text-slate-900">
                    <span className="grid size-10 place-items-center rounded-2xl bg-slate-900 text-white">
                      <MessageCircle size={18} strokeWidth={1.5} />
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-slate-950">
                        Create seat hold
                      </p>
                      <p className="text-xs text-slate-500">
                        Capture WhatsApp reservations before checkout completes.
                      </p>
                    </div>
                  </div>

                  <div className="mt-5 grid gap-3">
                    <select
                      value={lockForm.sailingId}
                      onChange={(event) => updateLockForm("sailingId", event.target.value)}
                      className="h-12 rounded-2xl border border-slate-200 bg-white px-4 text-sm text-slate-700 outline-none"
                    >
                      {sailings.map((sailing) => {
                        const cruise = cruises.find((item) => item.slug === sailing.cruiseSlug)

                        return (
                          <option key={sailing.id} value={sailing.id}>
                            {cruise?.title} · {sailing.label}
                          </option>
                        )
                      })}
                    </select>
                    <input
                      value={lockForm.guestName}
                      onChange={(event) => updateLockForm("guestName", event.target.value)}
                      placeholder="Guest name"
                      className="h-12 rounded-2xl border border-slate-200 bg-white px-4 text-sm text-slate-700 outline-none"
                    />
                    <input
                      value={lockForm.phone}
                      onChange={(event) => updateLockForm("phone", event.target.value)}
                      placeholder="WhatsApp number"
                      className="h-12 rounded-2xl border border-slate-200 bg-white px-4 text-sm text-slate-700 outline-none"
                    />
                    <input
                      value={lockForm.seats}
                      onChange={(event) => updateLockForm("seats", event.target.value)}
                      placeholder="Seats, e.g. S11,S12"
                      className="h-12 rounded-2xl border border-slate-200 bg-white px-4 text-sm text-slate-700 outline-none"
                    />
                    <textarea
                      value={lockForm.notes}
                      onChange={(event) => updateLockForm("notes", event.target.value)}
                      placeholder="Operator notes"
                      className="min-h-24 rounded-2xl border border-slate-200 bg-white px-4 py-4 text-sm text-slate-700 outline-none"
                    />
                    <Button
                      className="h-12 rounded-2xl bg-slate-950 text-white hover:bg-slate-800"
                      onClick={saveWhatsappLock}
                    >
                      <Lock strokeWidth={1.4} />
                      Lock seats
                    </Button>
                    <Button
                      variant="outline"
                      className="h-12 rounded-2xl border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
                      onClick={clearLocks}
                    >
                      <Trash2 strokeWidth={1.4} />
                      Clear all locks
                    </Button>
                  </div>
                </div>

                <div className="overflow-hidden rounded-[22px] border border-slate-200">
                  <div className="grid grid-cols-[1fr_auto] gap-3 border-b border-slate-200 bg-slate-50 px-5 py-4">
                    <div>
                      <p className="text-sm font-semibold text-slate-950">
                        Active holds
                      </p>
                      <p className="text-xs text-slate-500">
                        Release manually once a hold expires or payment clears.
                      </p>
                    </div>
                    <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-600 ring-1 ring-slate-200">
                      {filteredLocks.length} active
                    </span>
                  </div>

                  {filteredLocks.map((lock) => {
                    const sailing = sailings.find((item) => item.id === lock.sailingId)
                    const cruise = cruises.find((item) => item.slug === sailing?.cruiseSlug)

                    return (
                      <div
                        key={lock.id}
                        className="grid gap-4 border-t border-slate-200 bg-white px-5 py-5 text-sm first:border-t-0 lg:grid-cols-[1fr_1fr_auto_auto]"
                      >
                        <div>
                          <p className="font-semibold text-slate-950">
                            {lock.guestName}
                          </p>
                          <p className="mt-1 text-xs text-slate-500">
                            {lock.phone}
                          </p>
                        </div>
                        <div>
                          <p className="font-medium text-slate-900">
                            {cruise?.title}
                          </p>
                          <p className="mt-1 text-xs text-slate-500">
                            {sailing?.label} · {lock.source}
                          </p>
                        </div>
                        <div className="font-semibold text-slate-950">
                          {lock.seats.join(", ")}
                        </div>
                        <div className="flex justify-start lg:justify-end">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-10 rounded-xl bg-slate-50 px-4 text-slate-700 ring-1 ring-slate-200 hover:bg-slate-100"
                            onClick={() => {
                              removeAdminSeatLock(lock.id)
                              syncBookings()
                            }}
                          >
                            <LockOpen strokeWidth={1.4} />
                            Release
                          </Button>
                        </div>
                      </div>
                    )
                  })}

                  {filteredLocks.length === 0 ? (
                    <div className="bg-white px-6 py-10 text-sm text-slate-500">
                      No active WhatsApp seat locks right now.
                    </div>
                  ) : null}
                </div>
              </div>
            ) : null}

            {activeView === "operations" ? (
              <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
                <div className="rounded-[22px] border border-slate-200 bg-slate-50 p-5">
                  <p className="text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-slate-400">
                    System notes
                  </p>
                  <div className="mt-4 grid gap-3">
                    {[
                      "New paid mock bookings appear here after checkout confirmation.",
                      "Production will replace local storage with Supabase realtime.",
                      "Razorpay webhook verification remains the booking confirmation gate.",
                      "Seat locks should expire through scheduled cleanup before production launch.",
                    ].map((item) => (
                      <div
                        key={item}
                        className="rounded-2xl border border-slate-200 bg-white px-4 py-4 text-sm leading-7 text-slate-600"
                      >
                        {item}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-[22px] border border-slate-200 bg-slate-950 p-5 text-white">
                  <p className="text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-slate-300">
                    Operator checklist
                  </p>
                  <div className="mt-4 grid gap-3">
                    {[
                      "Refresh local state before opening daily operations.",
                      "Export booking JSON before clearing browser-only data.",
                      "Confirm release of stale WhatsApp holds at shift handoff.",
                      "Validate webhook status before ticket dispatch during payment testing.",
                    ].map((item) => (
                      <div
                        key={item}
                        className="rounded-2xl border border-white/10 bg-white/5 px-4 py-4 text-sm leading-7 text-slate-200"
                      >
                        {item}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        </section>
      </div>
    </div>
  )
}
