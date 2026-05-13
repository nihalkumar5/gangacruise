import type { SeatState } from "@/lib/data/cruises"

export type GuestDetails = {
  name: string
  email: string
  phone: string
}

export type BookingSnapshot = {
  id: string
  sailingId: string
  cruiseTitle: string
  location: string
  date: string
  guests: number
  seats: string[]
  subtotal: number
  tax: number
  total: number
  guest: GuestDetails
  status: "held" | "payment_created" | "confirmed"
}

export type SeatView = {
  id: string
  label: string
  category: string
  state: SeatState
}

export type SearchSnapshot = {
  location: string
  date: string
  guests: number
}

export type AdminBookingRecord = BookingSnapshot & {
  confirmedAt: string
}

export type AdminSeatLockRecord = {
  id: string
  sailingId: string
  seats: string[]
  guestName: string
  phone: string
  source: "whatsapp" | "phone" | "agent" | "manual"
  notes: string
  lockedAt: string
}

export const LAST_BOOKING_STORAGE_KEY = "ganga:lastBooking"
export const LAST_SEARCH_STORAGE_KEY = "ganga:lastSearch"
export const ADMIN_BOOKINGS_STORAGE_KEY = "ganga:adminBookings"
export const ADMIN_SEAT_LOCKS_STORAGE_KEY = "ganga:adminSeatLocks"

export function saveBookingSnapshot(snapshot: BookingSnapshot) {
  window.localStorage.setItem(LAST_BOOKING_STORAGE_KEY, JSON.stringify(snapshot))
}

export function readBookingSnapshot() {
  try {
    const raw = window.localStorage.getItem(LAST_BOOKING_STORAGE_KEY)

    if (!raw) {
      return null
    }

    return JSON.parse(raw) as BookingSnapshot
  } catch {
    return null
  }
}

export function saveSearchSnapshot(snapshot: SearchSnapshot) {
  window.localStorage.setItem(LAST_SEARCH_STORAGE_KEY, JSON.stringify(snapshot))
}

export function readSearchSnapshot() {
  try {
    const raw = window.localStorage.getItem(LAST_SEARCH_STORAGE_KEY)

    if (!raw) {
      return null
    }

    return JSON.parse(raw) as SearchSnapshot
  } catch {
    return null
  }
}

export function readAdminBookings() {
  try {
    const raw = window.localStorage.getItem(ADMIN_BOOKINGS_STORAGE_KEY)

    if (!raw) {
      return []
    }

    return JSON.parse(raw) as AdminBookingRecord[]
  } catch {
    return []
  }
}

export function writeAdminBookings(bookings: AdminBookingRecord[]) {
  window.localStorage.setItem(
    ADMIN_BOOKINGS_STORAGE_KEY,
    JSON.stringify(bookings.slice(0, 50)),
  )
}

export function clearAdminBookings() {
  window.localStorage.removeItem(ADMIN_BOOKINGS_STORAGE_KEY)
}

export function saveAdminBooking(snapshot: BookingSnapshot) {
  const current = readAdminBookings()
  const next: AdminBookingRecord = {
    ...snapshot,
    confirmedAt: new Date().toISOString(),
  }

  const deduped = current.filter((booking) => booking.id !== snapshot.id)
  writeAdminBookings([next, ...deduped])
}

export function readAdminSeatLocks() {
  try {
    const raw = window.localStorage.getItem(ADMIN_SEAT_LOCKS_STORAGE_KEY)

    if (!raw) {
      return []
    }

    return JSON.parse(raw) as AdminSeatLockRecord[]
  } catch {
    return []
  }
}

export function writeAdminSeatLocks(locks: AdminSeatLockRecord[]) {
  window.localStorage.setItem(
    ADMIN_SEAT_LOCKS_STORAGE_KEY,
    JSON.stringify(locks.slice(0, 100)),
  )
}

export function clearAdminSeatLocks() {
  window.localStorage.removeItem(ADMIN_SEAT_LOCKS_STORAGE_KEY)
}

export function saveAdminSeatLock(lock: Omit<AdminSeatLockRecord, "id" | "lockedAt">) {
  const current = readAdminSeatLocks()
  const next: AdminSeatLockRecord = {
    ...lock,
    id: `lock_${lock.sailingId}_${lock.seats.join("-").toLowerCase()}_${Date.now()}`,
    lockedAt: new Date().toISOString(),
  }

  const filtered = current.filter(
    (item) =>
      !(item.sailingId === lock.sailingId && item.seats.some((seat) => lock.seats.includes(seat))),
  )

  writeAdminSeatLocks([next, ...filtered])
}

export function removeAdminSeatLock(lockId: string) {
  const current = readAdminSeatLocks()
  writeAdminSeatLocks(current.filter((lock) => lock.id !== lockId))
}
