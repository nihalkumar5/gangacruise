"use server"

import { redirect } from "next/navigation"

import {
  clearGuestSession,
  setGuestSession,
  verifyGuestOtp,
} from "@/lib/auth/guest-session"

export async function loginGuestAction(formData: FormData) {
  const email = String(formData.get("email") ?? "")
  const otp = String(formData.get("otp") ?? "")

  if (!verifyGuestOtp(email, otp)) {
    redirect("/account/login?error=invalid")
  }

  await setGuestSession(email)
  redirect("/account")
}

export async function logoutGuestAction() {
  await clearGuestSession()
  redirect("/account/login")
}
