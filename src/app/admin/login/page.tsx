import { redirect } from "next/navigation"
import { ArrowRight, LockKeyhole, ShieldCheck } from "lucide-react"

import { StatusBadge } from "@/components/shared/status-badge"
import { Button } from "@/components/ui/button"
import { loginAdminAction } from "@/app/admin/actions"
import { getAdminEmail, getAdminSession } from "@/lib/auth/admin-session"

type AdminLoginPageProps = {
  searchParams: Promise<{ error?: string }>
}

export default async function AdminLoginPage({
  searchParams,
}: AdminLoginPageProps) {
  const session = await getAdminSession()

  if (session) {
    redirect("/admin")
  }

  const { error } = await searchParams

  return (
    <main className="min-h-dvh bg-[#f6f8fb] px-4 py-8 text-slate-950 sm:px-6">
      <div className="mx-auto grid min-h-[calc(100dvh-4rem)] w-full max-w-6xl gap-6 lg:grid-cols-[1.05fr_0.95fr]">
        <section className="flex flex-col justify-between rounded-[32px] bg-slate-950 p-8 text-white shadow-[0_36px_90px_rgba(15,23,42,0.22)] sm:p-10">
          <div>
            <StatusBadge tone="success">Admin secure</StatusBadge>
            <h1 className="mt-6 text-4xl font-semibold tracking-tight sm:text-5xl">
              Operate bookings like a real control room.
            </h1>
            <p className="mt-5 max-w-xl text-sm leading-7 text-slate-300 sm:text-base">
              Access inventory, payment-confirmed bookings, seat holds, exports,
              and operational notes from one focused workspace built for daily
              cruise operations.
            </p>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            {[
              {
                label: "Live inventory",
                copy: "Watch seat pressure and availability across departures.",
              },
              {
                label: "Seat holds",
                copy: "Capture WhatsApp locks before payment confirmation.",
              },
              {
                label: "Exports",
                copy: "Download portable booking data for operations handoff.",
              },
            ].map((item) => (
              <div
                key={item.label}
                className="rounded-[24px] border border-white/10 bg-white/5 p-4"
              >
                <p className="text-sm font-semibold text-white">{item.label}</p>
                <p className="mt-2 text-xs leading-6 text-slate-300">
                  {item.copy}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="flex items-center">
          <div className="w-full rounded-[32px] border border-slate-200 bg-white p-8 shadow-[0_28px_80px_rgba(15,23,42,0.08)] sm:p-10">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-slate-500">
                  GangaCruise admin
                </p>
                <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">
                  Sign in
                </h2>
              </div>
              <span className="grid size-12 place-items-center rounded-2xl bg-slate-950 text-white">
                <LockKeyhole strokeWidth={1.5} />
              </span>
            </div>

            <div className="mt-5 flex items-center gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
              <ShieldCheck size={18} strokeWidth={1.5} />
              Protected access for operations, inventory, revenue, and seat holds.
            </div>

            <form action={loginAdminAction} className="mt-8 grid gap-4">
              <label className="grid gap-2">
                <span className="text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-slate-500">
                  Email
                </span>
                <input
                  name="email"
                  type="email"
                  defaultValue={getAdminEmail()}
                  autoComplete="username"
                  className="h-14 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm text-slate-900 outline-none transition focus:border-slate-950 focus:bg-white"
                  required
                />
              </label>
              <label className="grid gap-2">
                <span className="text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-slate-500">
                  Password
                </span>
                <input
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  placeholder="Enter admin password"
                  className="h-14 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm text-slate-900 outline-none transition focus:border-slate-950 focus:bg-white"
                  required
                />
              </label>

              {error === "invalid" ? (
                <p className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  Invalid admin credentials.
                </p>
              ) : null}

              <Button
                className="h-14 rounded-2xl bg-slate-950 text-white hover:bg-slate-800"
                type="submit"
              >
                Sign in to workspace
                <ArrowRight strokeWidth={1.5} />
              </Button>

              <p className="text-xs leading-6 text-slate-500">
                Local default password:{" "}
                <span className="font-semibold text-slate-900">
                  ganga-admin-2026
                </span>
                . Set `ADMIN_PASSWORD_HASH` before production.
              </p>
            </form>
          </div>
        </section>
      </div>
    </main>
  )
}
