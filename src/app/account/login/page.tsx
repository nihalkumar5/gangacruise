import { redirect } from "next/navigation"
import { MailCheck } from "lucide-react"

import { loginGuestAction } from "@/app/account/actions"
import { GlassPanel } from "@/components/luxury/glass-panel"
import { StatusBadge } from "@/components/shared/status-badge"
import { Button } from "@/components/ui/button"
import { getGuestSession } from "@/lib/auth/guest-session"

type GuestLoginPageProps = {
  searchParams: Promise<{ error?: string }>
}

export default async function GuestLoginPage({
  searchParams,
}: GuestLoginPageProps) {
  const session = await getGuestSession()

  if (session) {
    redirect("/account")
  }

  const { error } = await searchParams

  return (
    <main className="grid min-h-dvh place-items-center bg-[#f4f0ec] px-4 py-12">
      <GlassPanel className="w-full max-w-md" innerClassName="p-8">
        <div className="flex items-center justify-between gap-4">
          <StatusBadge>Guest access</StatusBadge>
          <span className="grid size-11 place-items-center rounded-full bg-lotus/10 text-lotus">
            <MailCheck strokeWidth={1.45} />
          </span>
        </div>
        <h1 className="mt-8 font-display text-5xl leading-none text-river">
          View your bookings.
        </h1>
        <p className="mt-5 text-sm leading-7 text-river/60">
          Sign in with the same email used during checkout to see tickets and
          booking history.
        </p>

        <form action={loginGuestAction} className="mt-8 grid gap-4">
          <label className="grid gap-2">
            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-river/45">
              Booking email
            </span>
            <input
              name="email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              className="h-14 rounded-2xl border border-stone-200 bg-white px-4 py-4 text-sm text-river outline-none transition focus:border-lotus/45"
              required
            />
          </label>
          <label className="grid gap-2">
            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-river/45">
              OTP
            </span>
            <input
              name="otp"
              inputMode="numeric"
              autoComplete="one-time-code"
              placeholder="123456"
              className="h-14 rounded-2xl border border-stone-200 bg-white px-4 py-4 text-sm text-river outline-none transition focus:border-lotus/45"
              required
            />
          </label>

          {error === "invalid" ? (
            <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700 ring-1 ring-red-200">
              Invalid email or OTP.
            </p>
          ) : null}

          <Button className="h-14" type="submit">
            Sign in
          </Button>
          <p className="text-xs leading-6 text-river/45">
            Local OTP: <span className="font-semibold">123456</span>. Production
            should use Supabase Auth or an email OTP provider.
          </p>
        </form>
      </GlassPanel>
    </main>
  )
}
