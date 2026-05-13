import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowRight, Clock3, IndianRupee, UsersRound } from "lucide-react"

import { LuxuryNav } from "@/components/layout/luxury-nav"
import { GlassPanel } from "@/components/luxury/glass-panel"
import { Reveal } from "@/components/luxury/reveal"
import { SiteFooter } from "@/components/shared/site-footer"
import { StatusBadge } from "@/components/shared/status-badge"
import { Button } from "@/components/ui/button"
import { formatPrice, getCruiseBySlug, sailings } from "@/lib/data/cruises"

type CruiseDetailPageProps = {
  params: Promise<{ slug: string }>
}

export default async function CruiseDetailPage({ params }: CruiseDetailPageProps) {
  const { slug } = await params
  const cruise = getCruiseBySlug(slug)

  if (!cruise) {
    notFound()
  }

  const sailing = sailings.find((item) => item.cruiseSlug === cruise.slug)

  return (
    <>
      <LuxuryNav />
      <main>
        <section className="relative min-h-[82svh] overflow-hidden px-4 pb-12 pt-32">
          <Image
            src="/images/ganga-hero-dawn.png"
            alt={cruise.title}
            fill
            priority
            sizes="100vw"
            className="absolute inset-0 -z-30 object-cover"
            style={{ objectPosition: cruise.imagePosition }}
          />
          <div className="absolute inset-0 -z-20 bg-[linear-gradient(90deg,rgba(26,15,14,.78),rgba(26,15,14,.42),rgba(26,15,14,.12))]" />
          <div className="absolute inset-x-0 bottom-0 -z-10 h-1/2 bg-gradient-to-t from-[#f4f0ec] to-transparent" />
          <div className="luxury-shell flex min-h-[calc(82svh-10rem)] flex-col justify-end">
            <Reveal className="max-w-4xl">
              <StatusBadge>{cruise.mood}</StatusBadge>
              <h1 className="mt-6 font-display text-6xl font-medium leading-[0.9] text-white sm:text-8xl">
                {cruise.title}
              </h1>
              <p className="mt-7 max-w-2xl text-lg leading-8 text-white/80">
                {cruise.description}
              </p>
            </Reveal>
          </div>
        </section>

        <section className="py-20">
          <div className="luxury-shell grid gap-5 lg:grid-cols-[1fr_24rem]">
            <Reveal>
              <GlassPanel innerClassName="p-8 sm:p-10">
                <h2 className="font-display text-5xl text-river">Included moments</h2>
                <div className="mt-8 grid gap-4 sm:grid-cols-2">
                  {cruise.highlights.map((highlight) => (
                    <div key={highlight} className="border-t border-stone-200 pt-5">
                      <p className="text-river">{highlight}</p>
                      <p className="mt-2 text-sm leading-6 text-river/52">
                        Delivered with quiet timing and premium service.
                      </p>
                    </div>
                  ))}
                </div>
              </GlassPanel>
            </Reveal>

            <Reveal delay={0.08}>
              <GlassPanel innerClassName="p-7">
                <div className="grid gap-5">
                  <div className="flex items-center gap-3 text-river/70">
                    <Clock3 strokeWidth={1.3} />
                    {cruise.duration} · {cruise.time}
                  </div>
                  <div className="flex items-center gap-3 text-river/70">
                    <UsersRound strokeWidth={1.3} />
                    {cruise.seatsLeft} of {cruise.capacity} seats available
                  </div>
                  <div className="flex items-center gap-3 text-river/70">
                    <IndianRupee strokeWidth={1.3} />
                    {formatPrice(cruise.price)} starting fare
                  </div>
                </div>
                <Button asChild className="mt-8 h-14 w-full">
                  <Link href={`/booking/${sailing?.id ?? "sailing_aarti_today"}`}>
                    Reserve this cruise
                    <ArrowRight data-icon="inline-end" strokeWidth={1.4} />
                  </Link>
                </Button>
              </GlassPanel>
            </Reveal>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  )
}
