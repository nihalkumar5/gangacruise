"use client"
import { motion } from "framer-motion"
import Link from "next/link"
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
import { TestimonialsColumn } from "@/components/ui/testimonials-columns-1"

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
  },
  {
    title: "Evening Aarti Reserve",
    meta: "17:45 / 110 min",
    copy: "A composed premium deck view of ceremony, lamps, sound, and reflection.",
  },
  {
    title: "Private Celebration",
    meta: "By request / 2-3 hrs",
    copy: "A tailored river evening for families, founders, and wedding guests.",
  },
]

const testimonials = [
  {
    text: "The cruise felt perfectly timed around the light. Boarding was calm, the seats were ready, and the team made the whole morning feel effortless.",
    image:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=160&q=80",
    name: "Aarav Mehta",
    role: "Dawn cruise guest",
  },
  {
    text: "We booked for visiting family and everything was handled with a rare amount of grace. The river view during aarti was unforgettable.",
    image:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=160&q=80",
    name: "Mira Kapoor",
    role: "Evening aarti guest",
  },
  {
    text: "The private deck had exactly the right mood for our celebration. Quiet service, clear communication, and no crowding.",
    image:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=160&q=80",
    name: "Naina Shah",
    role: "Private charter host",
  },
  {
    text: "Seat selection and checkout were simple, but the experience still felt premium from the first message to boarding.",
    image:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=160&q=80",
    name: "Kabir Sethi",
    role: "Weekend guest",
  },
  {
    text: "Our guide knew when to speak and when to let the river do the work. That restraint made the whole trip feel special.",
    image:
      "https://images.unsplash.com/photo-1554151228-14d9def656e4?auto=format&fit=crop&w=160&q=80",
    name: "Leela Rao",
    role: "Story cruise guest",
  },
  {
    text: "The team coordinated our group without making it feel managed. Everyone simply arrived, settled in, and enjoyed the evening.",
    image:
      "https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?auto=format&fit=crop&w=160&q=80",
    name: "Rohan Bansal",
    role: "Group booking lead",
  },
  {
    text: "The ticket and reminders made planning easy. On the boat, the details were polished without becoming formal.",
    image:
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=160&q=80",
    name: "Anika Sen",
    role: "Sunrise guest",
  },
  {
    text: "I wanted something peaceful for my parents, and this was exactly that. Slow, beautiful, and very thoughtfully hosted.",
    image:
      "https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?auto=format&fit=crop&w=160&q=80",
    name: "Dev Malhotra",
    role: "Family host",
  },
  {
    text: "The boat never felt rushed. From tea to the final return, every touchpoint had a sense of care.",
    image:
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=160&q=80",
    name: "Sara Thomas",
    role: "Private evening guest",
  },
]

const firstColumn = testimonials.slice(0, 3)
const secondColumn = testimonials.slice(3, 6)
const thirdColumn = testimonials.slice(6, 9)

export function HomePage() {
  return (
    <>
      <LuxuryNav />
      <main>
        <CinematicHero />

        <section className="bg-white py-20 sm:py-28">
          <div className="luxury-shell grid gap-14 lg:grid-cols-[0.85fr_1fr_1fr_1fr] lg:items-start">
            <Reveal>
              <p className="text-[0.75rem] font-black uppercase tracking-[0.2em] text-blue-600">
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
                    <h3 className="text-2xl font-bold tracking-tight text-stone-900 transition-colors duration-500 group-hover:text-blue-600">
                      {value.label}
                    </h3>
                    <p className="mt-4 max-w-[220px] text-sm font-medium leading-relaxed text-stone-500/80">
                      {value.copy}
                    </p>
                    <motion.div
                      initial={{ width: 0 }}
                      whileHover={{ width: 40 }}
                      className="mt-6 h-1 rounded-full bg-blue-600/20 transition-all duration-500"
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
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-lotus">
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

          <div className="luxury-shell mt-14 grid gap-5 lg:grid-cols-[1.2fr_0.9fr_0.9fr]">
            {cruises.map((cruise, index) => (
              <Reveal key={cruise.title} delay={index * 0.08}>
                <article className="group flex min-h-[23rem] flex-col justify-between rounded-[2.2rem] bg-white p-7 shadow-[0_28px_70px_rgba(69,45,28,0.1)] transition duration-700 hover:-translate-y-1 sm:p-9">
                  <div>
                    <div className="mb-8 flex items-center justify-between text-sm font-semibold uppercase tracking-[0.18em] text-lotus/80">
                      <span>{cruise.meta}</span>
                      <Ship strokeWidth={1.45} />
                    </div>
                    <h3 className="font-display text-5xl font-medium leading-none text-river">
                      {cruise.title}
                    </h3>
                    <p className="mt-6 max-w-md text-base leading-8 text-river/60">
                      {cruise.copy}
                    </p>
                  </div>
                  <Link
                    href="/booking"
                    className="mt-10 inline-flex items-center gap-3 text-sm font-bold text-lotus"
                  >
                    Reserve this cruise
                    <ArrowRight strokeWidth={1.45} />
                  </Link>
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

        <section className="relative overflow-hidden bg-background py-24 sm:py-32">
          <div className="luxury-shell relative">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              viewport={{ once: true }}
              className="mx-auto flex max-w-[540px] flex-col items-center justify-center"
            >
              <div className="flex justify-center">
                <div className="rounded-lg border border-border bg-white/70 px-4 py-1 text-sm font-semibold text-lotus shadow-sm">
                  Testimonials
                </div>
              </div>

              <h2 className="mt-5 text-center font-display text-5xl font-medium leading-[0.95] text-river sm:text-6xl">
                What our guests say
              </h2>
              <p className="mt-5 text-center text-base leading-8 text-river/65">
                Real notes from hosted departures, private decks, family gatherings, and
                quiet morning passages.
              </p>
            </motion.div>

            <div className="mt-10 flex max-h-[740px] justify-center gap-6 overflow-hidden [mask-image:linear-gradient(to_bottom,transparent,black_25%,black_75%,transparent)]">
              <TestimonialsColumn testimonials={firstColumn} duration={15} />
              <TestimonialsColumn
                testimonials={secondColumn}
                className="hidden md:block"
                duration={19}
              />
              <TestimonialsColumn
                testimonials={thirdColumn}
                className="hidden lg:block"
                duration={17}
              />
            </div>
          </div>
        </section>

        <section className="relative overflow-hidden bg-[#f4f0ec] py-24 sm:py-32">
          <div className="absolute right-10 top-10 hidden h-40 w-40 rotate-12 rounded-[3rem] bg-lotus/8 md:block" />
          <Reveal className="luxury-shell grid gap-10 rounded-[2.6rem] bg-white p-8 shadow-[0_30px_90px_rgba(69,45,28,0.12)] sm:p-12 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-lotus">
                Ready when you are
              </p>
              <h2 className="mt-5 max-w-3xl font-display text-6xl font-medium leading-[0.94] text-river">
                Reserve a river moment without the clutter.
              </h2>
            </div>
            <Button asChild className="h-14 px-8">
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
