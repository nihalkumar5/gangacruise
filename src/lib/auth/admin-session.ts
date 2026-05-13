import "server-only"

import { createHmac, createHash, timingSafeEqual } from "crypto"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"

import { env } from "@/lib/env"

export type AdminSession = {
  email: string
  role: "admin"
  issuedAt: number
}

const ADMIN_COOKIE_NAME = "ganga_admin_session"
const SESSION_MAX_AGE = 60 * 60 * 8
const DEFAULT_ADMIN_EMAIL = "admin@ganga.local"
const DEFAULT_ADMIN_PASSWORD = "ganga-admin-2026"

function base64Url(input: string) {
  return Buffer.from(input).toString("base64url")
}

function fromBase64Url(input: string) {
  return Buffer.from(input, "base64url").toString("utf8")
}

function sessionSecret() {
  return env.ADMIN_SESSION_SECRET || "local-ganga-cruise-admin-session-secret"
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

function sha256(value: string) {
  return createHash("sha256").update(value).digest("hex")
}

export function getAdminEmail() {
  return env.ADMIN_EMAIL || DEFAULT_ADMIN_EMAIL
}

export function verifyAdminCredentials(email: string, password: string) {
  const expectedEmail = getAdminEmail().toLowerCase()
  const normalizedEmail = email.trim().toLowerCase()

  if (!safeEqual(normalizedEmail, expectedEmail)) {
    return false
  }

  if (env.ADMIN_PASSWORD_HASH) {
    return safeEqual(sha256(password), env.ADMIN_PASSWORD_HASH)
  }

  return safeEqual(password, env.ADMIN_PASSWORD || DEFAULT_ADMIN_PASSWORD)
}

export function createAdminToken(email: string) {
  const session: AdminSession = {
    email,
    role: "admin",
    issuedAt: Date.now(),
  }
  const payload = base64Url(JSON.stringify(session))
  const signature = signPayload(payload)

  return `${payload}.${signature}`
}

export function parseAdminToken(token: string | undefined) {
  if (!token) {
    return null
  }

  const [payload, signature] = token.split(".")

  if (!payload || !signature || !safeEqual(signPayload(payload), signature)) {
    return null
  }

  try {
    const session = JSON.parse(fromBase64Url(payload)) as AdminSession
    const expired = Date.now() - session.issuedAt > SESSION_MAX_AGE * 1000

    if (expired || session.role !== "admin") {
      return null
    }

    return session
  } catch {
    return null
  }
}

export async function setAdminSession(email: string) {
  const cookieStore = await cookies()

  cookieStore.set(ADMIN_COOKIE_NAME, createAdminToken(email), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  })
}

export async function clearAdminSession() {
  const cookieStore = await cookies()
  cookieStore.delete(ADMIN_COOKIE_NAME)
}

export async function getAdminSession() {
  const cookieStore = await cookies()
  return parseAdminToken(cookieStore.get(ADMIN_COOKIE_NAME)?.value)
}

export async function requireAdminSession() {
  const session = await getAdminSession()

  if (!session) {
    redirect("/admin/login")
  }

  return session
}
