import Image from "next/image"
import Link from "next/link"
import { ArrowRight, Clock3, MapPin, UsersRound } from "lucide-react"

import { LuxuryNav } from "@/components/layout/luxury-nav"
import { GlassPanel } from "@/components/luxury/glass-panel"
import { PageHero } from "@/components/shared/page-hero"
import { SiteFooter } from "@/components/shared/site-footer"
import { Button } from "@/components/ui/button"
import { cruises, sailings } from "@/lib/data/cruises"

type BookingPageProps = {
  searchParams: Promise<{
    location?: string
    date?: string
    guests?: string
  }>
}

export default async function BookingPage({ searchParams }: BookingPageProps) {
  const params = await searchParams
  const location = params.location ?? "Varanasi"
  const date = params.date ?? "2026-05-13"
  const guests = Math.max(Number(params.guests ?? "2") || 2, 1)
  const bookingQuery = new URLSearchParams({
    location,
    date,
    guests: String(guests),
  }).toString()

  return (
    <>
      <LuxuryNav />
      <main>
        <PageHero
          eyebrow="Reserve"
          title="Select a departure."
          copy={`Showing departures for ${location}, ${date}, ${guests} guest${guests === 1 ? "" : "s"}. Choose a sailing to hold seats.`}
        />
        <section className="pb-28">
          <div className="luxury-shell grid gap-6">
            {sailings.map((sailing) => {
              const cruise = cruises.find((item) => item.slug === sailing.cruiseSlug)

              return (
                <GlassPanel
                  key={sailing.id}
                  className="overflow-hidden"
                  innerClassName="grid gap-0 overflow-hidden p-0 lg:grid-cols-[24rem_1fr]"
                >
                  <div className="relative min-h-72 overflow-hidden bg-stone-200">
                    <Image
                      src="/images/ganga-hero-dawn.png"
                      alt={cruise?.title ?? "Ganga cruise"}
                      fill
                      priority
                      sizes="(min-width: 1024px) 24rem, 100vw"
                      className="object-cover transition duration-700 hover:scale-[1.035]"
                      style={{ objectPosition: cruise?.imagePosition ?? "64% 50%" }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/62 via-black/6 to-transparent" />
                    <div className="absolute bottom-5 left-5 rounded-full bg-white/90 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-lotus shadow-[0_18px_40px_rgba(0,0,0,0.18)]">
                      {cruise?.mood ?? "Cruise"}
                    </div>
                  </div>

                  <div className="grid gap-8 p-7 sm:p-9 xl:grid-cols-[1fr_auto] xl:items-end">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-[0.22em] text-lotus/70">
                        {sailing.label}
                      </p>
                      <h2 className="mt-4 font-display text-5xl leading-none text-river">
                        {cruise?.title}
                      </h2>
                      <p className="mt-4 max-w-2xl text-sm leading-7 text-river/58">
                        {cruise?.subtitle}
                      </p>
                      <div className="mt-7 flex flex-wrap gap-3 text-xs font-semibold uppercase tracking-[0.16em] text-river/52">
                        <span className="inline-flex items-center gap-2 rounded-full bg-stone-100 px-4 py-2">
                          <MapPin strokeWidth={1.35} />
                          {location}
                        </span>
                        <span className="inline-flex items-center gap-2 rounded-full bg-stone-100 px-4 py-2">
                          <Clock3 strokeWidth={1.35} />
                          {date}
                        </span>
                        <span className="inline-flex items-center gap-2 rounded-full bg-stone-100 px-4 py-2">
                          <UsersRound strokeWidth={1.35} />
                          {guests} guests
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-col gap-4 xl:items-end">
                      <p className="text-sm text-river/58">
                        <span className="font-semibold text-river">
                          {sailing.seatsLeft}
                        </span>{" "}
                        seats available
                      </p>
                      <Button asChild className="h-14 px-7">
                        <Link
                          href={`/booking/${sailing.id}?${bookingQuery}`}
                          scroll={false}
                        >
                          Select seats
                          <ArrowRight data-icon="inline-end" strokeWidth={1.4} />
                        </Link>
                      </Button>
                    </div>
                  </div>
                </GlassPanel>
              )
            })}
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  )
}
