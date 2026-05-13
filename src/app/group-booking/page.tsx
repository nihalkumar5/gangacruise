import Link from "next/link"
import { ArrowRight } from "lucide-react"

import { LuxuryNav } from "@/components/layout/luxury-nav"
import { GlassPanel } from "@/components/luxury/glass-panel"
import { PageHero } from "@/components/shared/page-hero"
import { SiteFooter } from "@/components/shared/site-footer"
import { Button } from "@/components/ui/button"

export default function GroupBookingPage() {
  return (
    <>
      <LuxuryNav />
      <main>
        <PageHero
          eyebrow="Private events"
          title="Host the river, not a banquet hall."
          copy="Private cruises for families, founders, wedding guests, and cultural evenings with a dedicated planning flow."
        />
        <section className="pb-28">
          <div className="luxury-shell">
            <GlassPanel innerClassName="grid gap-10 p-8 md:grid-cols-[1fr_auto] md:items-center sm:p-10">
              <div>
                <h2 className="font-display text-5xl text-river">Request a private quote.</h2>
                <p className="mt-5 max-w-2xl leading-8 text-river/62">
                  Share your guest count, date, and occasion. The production version
                  routes this into Supabase and notifies the operations team.
                </p>
              </div>
              <Button asChild className="h-14">
                <Link href="/booking">
                  Start enquiry
                  <ArrowRight data-icon="inline-end" strokeWidth={1.4} />
                </Link>
              </Button>
            </GlassPanel>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  )
}
