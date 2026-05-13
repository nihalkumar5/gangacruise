import Image from "next/image"
import Link from "next/link"
import {
  ArrowRight,
  CalendarRange,
  Flame,
  MoonStar,
  ShipWheel,
  Sparkles,
  Users,
  Waves,
} from "lucide-react"

import { LuxuryNav } from "@/components/layout/luxury-nav"
import { SiteFooter } from "@/components/shared/site-footer"
import { Button } from "@/components/ui/button"
import FlowArt, { FlowSection } from "@/components/ui/story-scroll"

const principles = [
  {
    title: "Quiet luxury",
    copy: "Every boarding moment is paced around calm, not rush. The river leads the tempo.",
    icon: MoonStar,
  },
  {
    title: "Hosted detail",
    copy: "Routes, tea service, music, and guest count are shaped to feel considered at every step.",
    icon: Sparkles,
  },
  {
    title: "Local reverence",
    copy: "We design around the emotional rhythm of Varanasi rather than treating it like a backdrop.",
    icon: Flame,
  },
]

const moments = [
  {
    label: "Sunrise sailings",
    copy: "Blue-hour departures timed for first light over the ghats.",
  },
  {
    label: "Private evenings",
    copy: "Celebrations, vows, and hosted gatherings with a composed deck flow.",
  },
  {
    label: "Custom pacing",
    copy: "Small-group journeys that never feel like a rushed tour loop.",
  },
]

export function OurStoryPage() {
  return (
    <>
      <LuxuryNav />
      <FlowArt aria-label="Our story">
        <FlowSection
          aria-label="Our story introduction"
          className="bg-[radial-gradient(circle_at_20%_18%,rgba(103,232,249,0.18),transparent_24rem),linear-gradient(180deg,#08131b_0%,#10202b_48%,#132d3c_100%)] text-white"
        >
          <div className="grid min-h-[74vh] gap-10 pt-24 lg:grid-cols-[1.05fr_0.95fr] lg:items-end lg:gap-14">
            <div className="max-w-3xl">
              <p className="text-[0.72rem] font-bold uppercase tracking-[0.26em] text-cyan-200/72">
                01 - Our story
              </p>
              <h1 className="mt-6 font-display text-[clamp(3.3rem,10vw,8rem)] leading-[0.88] tracking-tight">
                We built
                <br />
                GangaCruise
                <br />
                around reverence.
              </h1>
              <p className="mt-8 max-w-2xl text-[clamp(1.05rem,2vw,1.45rem)] leading-relaxed text-white/72">
                The river is not a prop. It is the reason people arrive in Varanasi with so much
                expectation. Our story began by asking what a luxury journey would feel like if it
                protected that emotion instead of crowding it.
              </p>
            </div>

            <div className="relative min-h-[22rem] overflow-hidden rounded-[2.3rem] border border-white/15 bg-white/6 shadow-[0_32px_80px_rgba(0,0,0,0.28)]">
              <Image
                src="/images/ganga-hero-dawn.png"
                alt="GangaCruise vessel on the river at dawn"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 42vw"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#08131b]/82 via-[#08131b]/20 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 grid gap-4 p-6 sm:grid-cols-3">
                {moments.map((moment) => (
                  <div
                    key={moment.label}
                    className="rounded-2xl border border-white/10 bg-black/18 p-4 backdrop-blur-md"
                  >
                    <p className="text-sm font-semibold text-white">{moment.label}</p>
                    <p className="mt-2 text-sm leading-6 text-white/68">{moment.copy}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </FlowSection>

        <FlowSection
          aria-label="Why we began"
          className="bg-[#f6f0e8] text-[#101820]"
        >
          <div className="grid min-h-[72vh] gap-10 pt-24 lg:grid-cols-[0.92fr_1.08fr] lg:items-end">
            <div>
              <p className="text-[0.72rem] font-bold uppercase tracking-[0.26em] text-[#0ea5cf]">
                02 - Why we began
              </p>
              <h2 className="mt-6 font-display text-[clamp(3rem,9vw,7rem)] leading-[0.88] tracking-tight">
                Too many river
                <br />
                journeys felt
                <br />
                transactional.
              </h2>
            </div>

            <div className="grid gap-5 sm:grid-cols-3">
              {principles.map((item) => {
                const Icon = item.icon

                return (
                  <article
                    key={item.title}
                    className="flex min-h-[17rem] flex-col justify-between rounded-[2rem] border border-black/10 bg-white/72 p-6 shadow-[0_22px_60px_rgba(69,45,28,0.08)] backdrop-blur-md"
                  >
                    <div className="grid size-12 place-items-center rounded-2xl bg-cyan-100 text-cyan-700">
                      <Icon size={22} strokeWidth={1.8} />
                    </div>
                    <div>
                      <h3 className="text-2xl font-semibold tracking-tight">{item.title}</h3>
                      <p className="mt-3 text-sm leading-7 text-black/64">{item.copy}</p>
                    </div>
                  </article>
                )
              })}
            </div>
          </div>

          <div className="mt-12 grid gap-6 border-t border-black/12 pt-6 lg:grid-cols-[1fr_auto] lg:items-end">
            <p className="max-w-3xl text-[clamp(1rem,1.9vw,1.35rem)] leading-relaxed text-black/68">
              We started refining an experience that feels slow, editorial, and emotionally
              grounded. Guest counts stay intentionally small. Service stays soft. The city remains
              the main character.
            </p>
            <div className="flex items-center gap-4 rounded-full border border-black/10 bg-white/68 px-5 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-black/65">
              <Waves size={18} strokeWidth={1.8} />
              Designed for stillness
            </div>
          </div>
        </FlowSection>

        <FlowSection
          aria-label="How the experience feels"
          className="bg-[linear-gradient(180deg,#061018_0%,#0d1a23_100%)] text-white"
        >
          <div className="grid min-h-[72vh] gap-10 pt-24 lg:grid-cols-[1fr_1fr] lg:items-center">
            <div className="relative aspect-[4/5] overflow-hidden rounded-[2.5rem] border border-white/10 bg-white/5 shadow-[0_30px_90px_rgba(0,0,0,0.3)]">
              <Image
                src="/images/ganga-hero-dawn.png"
                alt="Dawn on the Ganga with a cinematic river glow"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 40vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#061018] via-transparent to-transparent" />
            </div>

            <div>
              <p className="text-[0.72rem] font-bold uppercase tracking-[0.26em] text-cyan-200/72">
                03 - How it feels
              </p>
              <h2 className="mt-6 font-display text-[clamp(3rem,8.2vw,6.8rem)] leading-[0.9] tracking-tight">
                Soft boarding.
                <br />
                Open water.
                <br />
                No noise.
              </h2>
              <p className="mt-8 max-w-2xl text-[clamp(1rem,1.9vw,1.3rem)] leading-relaxed text-white/70">
                Great hospitality on the river is mostly invisible. It shows up in how guests are
                welcomed, where they first look, how space opens around the ceremony, and how every
                transition feels effortless.
              </p>

              <div className="mt-10 grid gap-4 sm:grid-cols-3">
                {[
                  { icon: ShipWheel, value: "15+", label: "Hosted route variations" },
                  { icon: CalendarRange, value: "365", label: "Days of seasonal planning" },
                  { icon: Users, value: "Small", label: "Guest counts by design" },
                ].map((item) => {
                  const Icon = item.icon

                  return (
                    <div
                      key={item.label}
                      className="rounded-[1.7rem] border border-white/10 bg-white/[0.04] p-5"
                    >
                      <Icon size={20} className="text-cyan-300" />
                      <p className="mt-6 text-3xl font-semibold tracking-tight">{item.value}</p>
                      <p className="mt-2 text-sm leading-6 text-white/60">{item.label}</p>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </FlowSection>

        <FlowSection
          aria-label="Our promise"
          className="bg-[linear-gradient(180deg,#63dff3_0%,#32c7ec_42%,#1495c7_100%)] text-[#04131b]"
        >
          <div className="grid min-h-[72vh] gap-10 pt-24 lg:grid-cols-[0.95fr_1.05fr] lg:items-end">
            <div>
              <p className="text-[0.72rem] font-bold uppercase tracking-[0.26em] text-[#083445]/70">
                04 - Our promise
              </p>
              <h2 className="mt-6 font-display text-[clamp(3rem,8.2vw,6.6rem)] leading-[0.88] tracking-tight">
                Every departure
                <br />
                should feel
                <br />
                composed.
              </h2>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              {[
                "You will never feel processed through a generic tour funnel.",
                "The ghats stay visible, not hidden behind loud staging or clutter.",
                "Private bookings still feel anchored to the spirit of the river.",
                "The booking journey remains simple without losing a premium tone.",
              ].map((promise, index) => (
                <article
                  key={promise}
                  className="rounded-[2rem] border border-black/10 bg-white/25 p-6 backdrop-blur-md"
                >
                  <p className="text-sm font-bold uppercase tracking-[0.22em] text-[#083445]/68">
                    0{index + 1}
                  </p>
                  <p className="mt-5 text-lg leading-8 text-[#04131b]/78">{promise}</p>
                </article>
              ))}
            </div>
          </div>
        </FlowSection>

        <FlowSection
          aria-label="Call to action"
          className="bg-[#05070a] text-white"
        >
          <div className="grid min-h-[72vh] gap-10 pt-24 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
            <div>
              <p className="text-[0.72rem] font-bold uppercase tracking-[0.26em] text-cyan-200/72">
                05 - Join the journey
              </p>
              <h2 className="mt-6 font-display text-[clamp(3.2rem,9vw,7.4rem)] leading-[0.88] tracking-tight">
                Come meet
                <br />
                Varanasi
                <br />
                by water.
              </h2>
              <p className="mt-8 max-w-2xl text-[clamp(1rem,1.9vw,1.35rem)] leading-relaxed text-white/68">
                Whether you are planning a sunrise sail, a private family gathering, or an evening
                that needs to feel unforgettable, we shape the route around presence first.
              </p>
            </div>

            <div className="rounded-[2.3rem] border border-white/10 bg-white/[0.04] p-7 shadow-[0_26px_80px_rgba(0,0,0,0.22)] backdrop-blur-xl">
              <p className="text-sm uppercase tracking-[0.24em] text-white/46">Next step</p>
              <p className="mt-4 text-2xl font-semibold leading-tight">
                Reserve a departure or design a private event with our team.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Button asChild className="h-14 bg-cyan-300 px-8 text-stone-900 hover:bg-cyan-200">
                  <Link href="/booking">Reserve now</Link>
                </Button>
                <Button asChild variant="outline" className="h-14 border-white/18 px-8 text-white hover:bg-white/8 hover:text-white">
                  <Link href="/group-booking">
                    Plan a private cruise
                    <ArrowRight size={18} strokeWidth={1.8} />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </FlowSection>
      </FlowArt>
      <SiteFooter />
    </>
  )
}
