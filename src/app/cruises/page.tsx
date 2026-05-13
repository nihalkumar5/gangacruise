import { CruiseCard } from "@/features/cruises/components/cruise-card"
import { PageHero } from "@/components/shared/page-hero"
import { SiteFooter } from "@/components/shared/site-footer"
import { LuxuryNav } from "@/components/layout/luxury-nav"
import { cruises } from "@/lib/data/cruises"

export default function CruisesPage() {
  return (
    <>
      <LuxuryNav />
      <main>
        <PageHero
          eyebrow="Live departures"
          title="Choose your river mood."
          copy="Browse curated Ganga cruise experiences with live seat indicators, premium deck availability, and calm mobile-first booking."
        />
        <section className="pb-28">
          <div className="luxury-shell grid gap-5 lg:grid-cols-3">
            {cruises.map((cruise, index) => (
              <CruiseCard key={cruise.id} cruise={cruise} priority={index === 0} />
            ))}
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  )
}
