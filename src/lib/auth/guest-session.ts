import "server-only"

import { createHmac, timingSafeEqual } from "crypto"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"

import { env } from "@/lib/env"

export type GuestSession = {
  email: string
  role: "guest"
  issuedAt: number
}

const GUEST_COOKIE_NAME = "ganga_guest_session"
const SESSION_MAX_AGE = 60 * 60 * 24 * 30
const DEFAULT_GUEST_OTP = "123456"

function base64Url(input: string) {
  return Buffer.from(input).toString("base64url")
}

function fromBase64Url(input: string) {
  return Buffer.from(input, "base64url").toString("utf8")
}

function sessionSecret() {
  return env.GUEST_SESSION_SECRET || "local-ganga-cruise-guest-session-secret"
}

function signPayload(payload: string) {
  return createHmac("sha256", sessionSecret()).update(payload).digest("base64url")
}

function safeEqual(left: string, right: string) {
  const leftBuffer = Buffer.from(left)
  const rightBuffer = Buffer.from(right)

  if (leftBuffer.length !== rightBuffer.length) {
    return false
  }

  return timingSafeEqual(leftBuffer, rightBuffer)
}

export function verifyGuestOtp(email: string, otp: string) {
  const normalizedEmail = email.trim().toLowerCase()

  if (!normalizedEmail.includes("@")) {
    return false
  }

  return safeEqual(otp.trim(), env.GUEST_LOGIN_OTP || DEFAULT_GUEST_OTP)
}

export function createGuestToken(email: string) {
  const session: GuestSession = {
    email: email.trim().toLowerCase(),
    role: "guest",
    issuedAt: Date.now(),
  }
  const payload = base64Url(JSON.stringify(session))
  const signature = signPayload(payload)

  return `${payload}.${signature}`
}

export function parseGuestToken(token: string | undefined) {
  if (!token) {
    return null
  }

  const [payload, signature] = token.split(".")

  if (!payload || !signature || !safeEqual(signPayload(payload), signature)) {
    return null
  }

  try {
    const session = JSON.parse(fromBase64Url(payload)) as GuestSession
    const expired = Date.now() - session.issuedAt > SESSION_MAX_AGE * 1000

    if (expired || session.role !== "guest") {
      return null
    }

    return session
  } catch {
    return null
  }
}

export async function setGuestSession(email: string) {
  const cookieStore = await cookies()

  cookieStore.set(GUEST_COOKIE_NAME, createGuestToken(email), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  })
}

export async function clearGuestSession() {
  const cookieStore = await cookies()
  cookieStore.delete(GUEST_COOKIE_NAME)
}

export async function getGuestSession() {
  const cookieStore = await cookies()
  return parseGuestToken(cookieStore.get(GUEST_COOKIE_NAME)?.value)
}

export async function requireGuestSession() {
  const session = await getGuestSession()

  if (!session) {
    redirect("/account/login")
  }

  return session
}
