"use client"
import { motion } from "framer-motion"
import Link from "next/link"
import Image from "next/image"
import {
  ArrowRight,
  CalendarCheck,
  Compass,
  CreditCard,
  Map,
  Ship,
  type LucideIcon,
} from "lucide-react"

import { LuxuryNav } from "@/components/layout/luxury-nav"
import { Reveal } from "@/components/luxury/reveal"
import { SiteFooter } from "@/components/shared/site-footer"
import { Button } from "@/components/ui/button"
import { PhotoGallery } from "@/components/ui/gallery"
import { StaggerTestimonials } from "@/components/ui/stagger-testimonials"
import { CinematicHero } from "./cinematic-hero"

type ValueCard = {
  icon: LucideIcon
  label: string
  copy: string
  glowClassName: string
  iconClassName: string
  iconHoverClassName: string
  duration: number
  delay?: number
}

const values: ValueCard[] = [
  {
    icon: Map,
    label: "Lots of choices",
    copy: "Sunrise, aarti, private gatherings, and calm hosted river passages.",
    glowClassName: "rotate-12 bg-yellow-400/10 group-hover:bg-yellow-400/30",
    iconClassName: "text-yellow-500",
    iconHoverClassName: "group-hover:scale-110 group-hover:rotate-3",
    duration: 4,
  },
  {
    icon: Compass,
    label: "Best tour guide",
    copy: "Local hosts keep the story graceful, specific, and never rushed.",
    glowClassName: "-rotate-12 bg-orange-400/10 group-hover:bg-orange-400/30",
    iconClassName: "text-orange-500",
    iconHoverClassName: "group-hover:scale-110 group-hover:-rotate-6",
    duration: 4.5,
    delay: 0.2,
  },
  {
    icon: CreditCard,
    label: "Easy booking",
    copy: "Live-style availability, seat holds, payment flow, and QR tickets.",
    glowClassName: "rotate-6 bg-blue-400/10 group-hover:bg-blue-400/30",
    iconClassName: "text-blue-500",
    iconHoverClassName: "group-hover:scale-110 group-hover:rotate-2",
    duration: 5,
    delay: 0.4,
  },
]

const cruises = [
  {
    title: "Dawn on the Ghats",
    meta: "05:15 / 90 min",
    copy: "A blue-hour passage with tea, soft commentary, and temple silhouettes.",
    image: "https://images.unsplash.com/photo-1561361058-c24cecae35ca?q=80&w=800&auto=format&fit=crop",
  },
  {
    title: "Evening Aarti Reserve",
    meta: "17:45 / 110 min",
    copy: "A composed premium deck view of ceremony, lamps, sound, and reflection.",
    image: "https://images.unsplash.com/photo-1627522460108-215683bdc9f6?auto=format&fit=crop&q=80&w=800",
  },
  {
    title: "Private Celebration",
    meta: "By request / 2-3 hrs",
    copy: "A tailored river evening for families, founders, and wedding guests.",
    image: "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=800&auto=format&fit=crop",
  },
]

export function HomePage() {
  return (
    <>
      <LuxuryNav />
      <main>
        <CinematicHero />

        <section className="bg-white py-20 sm:py-28">
          <div className="luxury-shell grid gap-14 lg:grid-cols-[0.85fr_1fr_1fr_1fr] lg:items-start">
            <Reveal>
              <p className="text-[0.75rem] font-black uppercase tracking-[0.2em] text-cyan-600">
                What we serve
              </p>
              <h2 className="mt-6 max-w-sm font-sans text-4xl font-bold uppercase leading-tight tracking-tight text-stone-900 sm:text-5xl">
                Top values <br /> for you
              </h2>
              <p className="mt-8 max-w-xs text-sm font-medium leading-relaxed text-stone-500">
                Embrace life&apos;s vastness, venture forth, and find your moment of
                clarity.
              </p>
            </Reveal>

            {values.map((value, index) => {
              const Icon = value.icon

              return (
                <Reveal key={value.label} delay={index * 0.08}>
                  <motion.article
                    whileHover={{ y: -8 }}
                    transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                    className="group cursor-pointer rounded-3xl p-4 transition-colors duration-500 hover:bg-stone-50/80"
                  >
                    <div className="mb-10 flex size-16 items-center justify-start">
                      <motion.div
                        animate={{ y: [0, -6, 0] }}
                        transition={{
                          duration: value.duration,
                          repeat: Infinity,
                          ease: "easeInOut",
                          delay: value.delay,
                        }}
                        className="relative"
                      >
                        <div
                          className={`absolute -inset-4 rounded-2xl blur-xl transition-all duration-500 ${value.glowClassName}`}
                        />
                        <Icon
                          size={46}
                          strokeWidth={1.5}
                          className={`relative transition-transform duration-500 ${value.iconClassName} ${value.iconHoverClassName}`}
                        />
                      </motion.div>
                    </div>
                    <h3 className="text-2xl font-bold tracking-tight text-stone-900 transition-colors duration-500 group-hover:text-cyan-600">
                      {value.label}
                    </h3>
                    <p className="mt-4 max-w-[220px] text-sm font-medium leading-relaxed text-stone-500/80">
                      {value.copy}
                    </p>
                    <motion.div
                      initial={{ width: 0 }}
                      whileHover={{ width: 40 }}
                      className="mt-6 h-1 rounded-full bg-cyan-600/20 transition-all duration-500"
                    />
                  </motion.article>
                </Reveal>
              )
            })}
          </div>
        </section>

        <section id="cruises" className="bg-[#fbf8f4] py-24 sm:py-32">
          <div className="luxury-shell grid gap-12 lg:grid-cols-[0.92fr_1.08fr] lg:items-end">
            <Reveal>
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-cyan-600">
                Curated departures
              </p>
              <h2 className="mt-6 max-w-2xl font-display text-6xl font-medium leading-[0.94] text-river sm:text-7xl">
                Three ways to meet the Ganga.
              </h2>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="max-w-2xl text-lg leading-9 text-river/60 lg:ml-auto">
                The platform keeps the booking experience simple, but the visual
                experience should still feel cinematic: large images, quiet spacing, and
                confident editorial hierarchy.
              </p>
            </Reveal>
          </div>

          <div className="luxury-shell mt-14 grid gap-8 lg:grid-cols-3">
            {cruises.map((cruise, index) => (
              <Reveal key={cruise.title} delay={index * 0.1}>
                <article className="group relative flex min-h-[30rem] flex-col overflow-hidden rounded-[2.5rem] bg-stone-900 shadow-2xl transition-all duration-700 hover:-translate-y-2">
                  {/* Background Image with Overlay */}
                  <div className="absolute inset-0">
                    <Image
                      src={cruise.image}
                      alt={cruise.title}
                      fill
                      priority={index < 3}
                      className="object-cover transition-transform duration-1000 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/40 to-transparent opacity-80" />
                  </div>

                  {/* Glass Content Card */}
                  <div className="relative flex flex-1 flex-col justify-between p-8 sm:p-10">
                    <div className="relative">
                      <div className="mb-6 flex items-center justify-between">
                        <span className="rounded-full bg-white/10 px-4 py-1.5 text-[0.65rem] font-bold uppercase tracking-[0.2em] text-white/90 backdrop-blur-md border border-white/10">
                          {cruise.meta}
                        </span>
                        <div className="rounded-full bg-white/10 p-2 text-white backdrop-blur-md border border-white/10">
                          <Ship size={18} strokeWidth={1.5} />
                        </div>
                      </div>
                      
                      <h3 className="font-display text-4xl font-medium leading-[1.1] text-white transition-colors duration-500 group-hover:text-cyan-200">
                        {cruise.title}
                      </h3>
                      <p className="mt-6 max-w-xs text-sm leading-relaxed text-white/70">
                        {cruise.copy}
                      </p>
                    </div>

                    <div className="relative pt-10">
                      <Link
                        href="/booking"
                        className="inline-flex h-12 items-center gap-3 rounded-full bg-white/10 px-6 text-xs font-bold uppercase tracking-[0.2em] text-white backdrop-blur-xl border border-white/20 transition-all duration-500 hover:bg-cyan-400 hover:text-stone-900 hover:border-transparent hover:shadow-[0_8px_20px_rgba(34,211,238,0.3)]"
                      >
                        Reserve
                        <ArrowRight size={16} strokeWidth={2} />
                      </Link>
                    </div>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </section>

        <section id="gallery" className="bg-[#f4f0ec] py-24 sm:py-32">
          <div className="luxury-shell">
            <PhotoGallery animationDelay={0.2} />
          </div>
        </section>

        <section className="relative overflow-hidden bg-background py-16 sm:py-24">
          <div className="luxury-shell relative">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              viewport={{ once: true }}
              className="mx-auto mb-16 flex max-w-[540px] flex-col items-center justify-center"
            >
              <div className="flex justify-center">
                <div className="rounded-lg border border-border bg-white/70 px-4 py-1.5 text-[0.65rem] font-bold uppercase tracking-[0.2em] text-cyan-600 shadow-sm">
                  Guest Journal
                </div>
              </div>

              <h2 className="mt-6 text-center font-display text-5xl font-medium leading-[0.95] text-river sm:text-7xl">
                What our guests say
              </h2>
              <p className="mt-6 text-center text-lg leading-8 text-river/60">
                Real notes from hosted departures, private decks, family gatherings, and
                quiet morning passages.
              </p>
            </motion.div>

            <div className="relative mt-0">
              <StaggerTestimonials />
            </div>
          </div>
        </section>

        <section className="relative overflow-hidden bg-[#f4f0ec] py-24 sm:py-32">
          <div className="absolute right-10 top-10 hidden h-40 w-40 rotate-12 rounded-[3rem] bg-lotus/8 md:block" />
          <Reveal className="luxury-shell grid gap-10 rounded-[2.6rem] bg-white p-8 shadow-[0_30px_90px_rgba(69,45,28,0.12)] sm:p-12 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-cyan-600">
                Ready when you are
              </p>
              <h2 className="mt-5 max-w-3xl font-display text-6xl font-medium leading-[0.94] text-river">
                Reserve a river moment without the clutter.
              </h2>
            </div>
            <Button asChild className="h-14 px-8 bg-cyan-400 hover:bg-cyan-300 text-stone-950 border-none shadow-[0_8px_24px_rgba(34,211,238,0.3)]">
              <Link href="/booking">
                Start booking
                <CalendarCheck strokeWidth={1.45} />
              </Link>
            </Button>
          </Reveal>
        </section>
      </main>
      <SiteFooter />
    </>
  )
}
