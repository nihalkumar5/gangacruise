"use server"

import { redirect } from "next/navigation"

import {
  clearAdminSession,
  setAdminSession,
  verifyAdminCredentials,
} from "@/lib/auth/admin-session"

export async function loginAdminAction(formData: FormData) {
  const email = String(formData.get("email") ?? "")
  const password = String(formData.get("password") ?? "")

  if (!verifyAdminCredentials(email, password)) {
    redirect("/admin/login?error=invalid")
  }

  await setAdminSession(email.trim().toLowerCase())
  redirect("/admin")
}

export async function logoutAdminAction() {
  await clearAdminSession()
  redirect("/admin/login")
}
