import { Button } from "@/components/ui/button"
import { logoutAdminAction } from "@/app/admin/actions"
import { AdminDashboard } from "@/features/admin/components/admin-dashboard"
import { requireAdminSession } from "@/lib/auth/admin-session"

export default async function AdminPage() {
  const session = await requireAdminSession()

  return (
    <main className="min-h-dvh bg-[#f6f8fb] text-slate-950">
      <div className="mx-auto flex min-h-dvh w-full max-w-[1440px] flex-col px-4 pb-8 pt-4 sm:px-6 lg:px-8">
        <header className="rounded-[28px] border border-slate-200 bg-white/92 px-5 py-4 shadow-[0_24px_70px_rgba(15,23,42,0.08)] backdrop-blur md:px-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-start gap-4">
              <div className="grid size-11 shrink-0 place-items-center rounded-2xl bg-slate-950 text-sm font-semibold uppercase tracking-[0.18em] text-white">
                GC
              </div>
              <div>
                <p className="text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-slate-500">
                  Operations console
                </p>
                <h1 className="mt-1 text-2xl font-semibold tracking-tight text-slate-950">
                  GangaCruise Admin
                </h1>
                <p className="mt-1 text-sm text-slate-500">
                  Signed in as {session.email}. Monitor revenue, bookings, seat
                  locks, and sailing health from one place.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700">
                Live workspace
              </div>
              <form action={logoutAdminAction}>
                <Button
                  type="submit"
                  variant="outline"
                  className="h-11 rounded-2xl border-slate-300 bg-white px-5 text-slate-700 hover:bg-slate-50"
                >
                  Sign out
                </Button>
              </form>
            </div>
          </div>
        </header>

        <section className="mt-6 flex-1">
          <AdminDashboard />
        </section>
      </div>
    </main>
  )
}
