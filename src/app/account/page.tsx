import { logoutGuestAction } from "@/app/account/actions"
import { LuxuryNav } from "@/components/layout/luxury-nav"
import { PageHero } from "@/components/shared/page-hero"
import { SiteFooter } from "@/components/shared/site-footer"
import { Button } from "@/components/ui/button"
import { GuestDashboard } from "@/features/account/components/guest-dashboard"
import { requireGuestSession } from "@/lib/auth/guest-session"

export default async function AccountPage() {
  const session = await requireGuestSession()

  return (
    <>
      <LuxuryNav />
      <main>
        <PageHero
          eyebrow="Guest account"
          title="Your bookings."
          copy={`Signed in as ${session.email}. View tickets, booking history, and payment summaries.`}
        />
        <section className="pb-6">
          <div className="luxury-shell flex justify-end">
            <form action={logoutGuestAction}>
              <Button type="submit" variant="outline">
                Sign out
              </Button>
            </form>
          </div>
        </section>
        <section className="pb-28">
          <GuestDashboard email={session.email} />
        </section>
      </main>
      <SiteFooter />
    </>
  )
}
