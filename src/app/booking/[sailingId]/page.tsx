import { notFound } from "next/navigation"

import { LuxuryNav } from "@/components/layout/luxury-nav"
import { SiteFooter } from "@/components/shared/site-footer"
import { BookingEngine } from "@/features/booking/components/booking-engine"
import { cruises, getSailingById } from "@/lib/data/cruises"

type BookingSailingPageProps = {
  params: Promise<{ sailingId: string }>
  searchParams: Promise<{
    location?: string
    date?: string
    guests?: string
  }>
}

export default async function BookingSailingPage({
  params,
  searchParams,
}: BookingSailingPageProps) {
  const { sailingId } = await params
  const query = await searchParams
  const sailing = getSailingById(sailingId)

  if (!sailing) {
    notFound()
  }

  const cruise = cruises.find((item) => item.slug === sailing.cruiseSlug)
  const location = query.location ?? "Varanasi"
  const date = query.date ?? sailing.startsAt.slice(0, 10)
  const guests = Math.max(Number(query.guests ?? "2") || 2, 1)

  return (
    <>
      <LuxuryNav />
      <main className="bg-[#05060a] text-white">
        <section className="pt-36 sm:pt-40">
          <div className="mx-auto grid w-full max-w-[1400px] gap-6 px-4 pb-10 sm:px-6 lg:grid-cols-[1fr_auto] lg:items-end lg:px-8">
            <div>
              <span className="inline-flex rounded-full border border-cyan-300/20 bg-cyan-300/10 px-3 py-1 text-[0.62rem] font-semibold uppercase tracking-[0.24em] text-cyan-100">
                Seat selection
              </span>
              <h1 className="mt-5 max-w-4xl text-4xl font-semibold leading-[0.95] text-white sm:text-6xl">
                Reserve the most cinematic seat on deck.
              </h1>
              <p className="mt-6 max-w-2xl text-base leading-8 text-white/58">
                {location} · {date} · {guests} guest{guests === 1 ? "" : "s"}.
                Zoom into the deck, compare seating zones, place a timed hold,
                and continue into secure payment.
              </p>
            </div>
            <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.04] px-5 py-4 text-sm font-semibold text-white/72 shadow-[0_20px_60px_rgba(0,0,0,0.18)]">
              Live inventory feel
            </div>
          </div>
        </section>
        <section className="pb-28">
          <div className="mx-auto w-full max-w-[1400px] px-4 sm:px-6 lg:px-8">
            <BookingEngine
              sailingId={sailing.id}
              title={cruise?.title ?? "Ganga cruise"}
              price={sailing.price}
              location={location}
              date={date}
              initialGuests={guests}
            />
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  )
}
