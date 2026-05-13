import Image from "next/image"
import Link from "next/link"
import { ArrowRight, Clock3, MapPin, UsersRound, Calendar, Sparkles, TrendingUp } from "lucide-react"

import { LuxuryNav } from "@/components/layout/luxury-nav"
import { GlassPanel } from "@/components/luxury/glass-panel"
import { SiteFooter } from "@/components/shared/site-footer"
import { Button } from "@/components/ui/button"
import { cruises, sailings, formatPrice } from "@/lib/data/cruises"
import { cn } from "@/lib/utils"

type BookingPageProps = {
  searchParams: Promise<{
    location?: string
    date?: string
    guests?: string
  }>
}

const cruiseImages: Record<string, string> = {
  "dawn-on-the-ghats": "https://images.unsplash.com/photo-1561361058-c24cecae35ca?q=80&w=800&auto=format&fit=crop",
  "evening-aarti-reserve": "https://images.unsplash.com/photo-1627522460108-215683bdc9f6?auto=format&fit=crop&q=80&w=800",
  "private-celebration": "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=800&auto=format&fit=crop"
};

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
    <div className="min-h-screen bg-[#fbf8f4]">
      <LuxuryNav />
      
      <main className="relative pt-32 sm:pt-40">
        {/* Abstract Background Texture */}
        <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
          <div className="absolute left-[10%] top-[5%] h-[500px] w-[500px] rounded-full bg-cyan-100/30 blur-[120px]" />
          <div className="absolute right-[5%] top-[15%] h-[400px] w-[400px] rounded-full bg-orange-50/40 blur-[100px]" />
        </div>

        {/* Header Section */}
        <div className="luxury-shell mb-16">
          <div className="max-w-4xl">
            <p className="mb-6 inline-flex items-center gap-2 rounded-full bg-cyan-600/10 px-4 py-1.5 text-[0.65rem] font-bold uppercase tracking-[0.2em] text-cyan-600">
              <Sparkles size={14} />
              Reservations
            </p>
            <h1 className="font-display text-6xl font-medium leading-[0.95] text-stone-950 sm:text-8xl">
              Choose your <span className="italic">passage</span>.
            </h1>
          </div>

          {/* Refine Search Bar */}
          <div className="mt-12 rounded-[2.5rem] border border-stone-200 bg-white/80 p-3 shadow-[0_20px_50px_rgba(0,0,0,0.05)] backdrop-blur-xl sm:p-4">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
              <div className="flex flex-1 flex-wrap items-center gap-4 px-4 sm:gap-8">
                <div className="flex items-center gap-3 py-2">
                  <div className="grid size-8 place-items-center rounded-full bg-stone-100 text-stone-500">
                    <MapPin size={16} />
                  </div>
                  <div>
                    <span className="block text-[0.6rem] font-bold uppercase tracking-widest text-stone-400">Location</span>
                    <span className="text-sm font-semibold text-stone-800">{location}</span>
                  </div>
                </div>
                <div className="h-8 w-px bg-stone-200 hidden sm:block" />
                <div className="flex items-center gap-3 py-2">
                  <div className="grid size-8 place-items-center rounded-full bg-stone-100 text-stone-500">
                    <Calendar size={16} />
                  </div>
                  <div>
                    <span className="block text-[0.6rem] font-bold uppercase tracking-widest text-stone-400">Date</span>
                    <span className="text-sm font-semibold text-stone-800">{date}</span>
                  </div>
                </div>
                <div className="h-8 w-px bg-stone-200 hidden sm:block" />
                <div className="flex items-center gap-3 py-2">
                  <div className="grid size-8 place-items-center rounded-full bg-stone-100 text-stone-500">
                    <UsersRound size={16} />
                  </div>
                  <div>
                    <span className="block text-[0.6rem] font-bold uppercase tracking-widest text-stone-400">Guests</span>
                    <span className="text-sm font-semibold text-stone-800">{guests} Guest{guests !== 1 && 's'}</span>
                  </div>
                </div>
              </div>
              <Button asChild variant="outline" className="h-14 rounded-full border-stone-200 px-8 font-bold uppercase tracking-widest text-stone-600 hover:bg-stone-50">
                <Link href="/">Modify</Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Sailings List */}
        <section className="pb-32">
          <div className="luxury-shell space-y-10">
            {sailings.map((sailing, idx) => {
              const cruise = cruises.find((item) => item.slug === sailing.cruiseSlug)
              const isFillingFast = sailing.seatsLeft <= 10
              
              return (
                <Reveal key={sailing.id} delay={idx * 0.1}>
                  <div className="group relative overflow-hidden rounded-[2.5rem] border border-stone-200 bg-white transition-all duration-700 hover:border-stone-300 hover:shadow-[0_40px_100px_rgba(0,0,0,0.08)]">
                    <div className="grid lg:grid-cols-[28rem_1fr]">
                      {/* Image Section */}
                      <div className="relative min-h-[320px] overflow-hidden lg:min-h-full">
                        <Image
                          src={cruiseImages[sailing.cruiseSlug] || "/images/ganga-hero-dawn.png"}
                          alt={cruise?.title ?? "Ganga cruise"}
                          fill
                          priority
                          sizes="(min-width: 1024px) 28rem, 100vw"
                          className="object-cover transition-transform duration-1000 group-hover:scale-110"
                          style={{ objectPosition: cruise?.imagePosition ?? "50% 50%" }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-stone-950/60 via-transparent to-transparent opacity-80" />
                        
                        <div className="absolute bottom-6 left-6 flex flex-wrap gap-2">
                          <div className="rounded-full bg-white/95 px-4 py-2 text-[0.65rem] font-black uppercase tracking-[0.18em] text-stone-900 shadow-xl backdrop-blur-md">
                            {cruise?.mood ?? "Cruise"}
                          </div>
                          {isFillingFast && (
                            <div className="inline-flex items-center gap-1.5 rounded-full bg-orange-500 px-4 py-2 text-[0.65rem] font-black uppercase tracking-[0.18em] text-white shadow-xl">
                              <TrendingUp size={12} />
                              Filling Fast
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Content Section */}
                      <div className="flex flex-col p-8 sm:p-12">
                        <div className="flex flex-col xl:flex-row xl:items-start xl:justify-between gap-6">
                          <div>
                            <p className="text-[0.65rem] font-bold uppercase tracking-[0.3em] text-stone-400">
                              {sailing.label}
                            </p>
                            <h2 className="mt-4 font-display text-5xl font-medium leading-[0.95] text-stone-900 sm:text-6xl">
                              {cruise?.title}
                            </h2>
                            <p className="mt-6 max-w-xl text-base leading-relaxed text-stone-500">
                              {cruise?.subtitle} {cruise?.description}
                            </p>
                          </div>
                          <div className="flex flex-col items-start xl:items-end">
                            <span className="text-[0.65rem] font-bold uppercase tracking-widest text-stone-400">From</span>
                            <p className="text-4xl font-display font-medium text-stone-950 mt-1">
                              {formatPrice(sailing.price)}
                            </p>
                            <span className="text-xs text-stone-400 mt-1">per guest</span>
                          </div>
                        </div>

                        <div className="mt-12 flex flex-1 flex-col justify-end gap-10">
                          <div className="flex flex-wrap gap-4">
                            {cruise?.highlights.map((highlight, hIdx) => (
                              <div key={hIdx} className="flex items-center gap-2 rounded-full border border-stone-100 bg-stone-50/50 px-4 py-2 text-xs font-medium text-stone-600">
                                <Sparkles size={12} className="text-cyan-500" />
                                {highlight}
                              </div>
                            ))}
                          </div>

                          <div className="flex flex-col items-center justify-between gap-8 pt-8 border-t border-stone-100 sm:flex-row">
                            <div className="flex items-center gap-10">
                              <div className="flex items-center gap-3">
                                <Clock3 size={18} className="text-stone-300" />
                                <div>
                                  <span className="block text-[0.6rem] font-bold uppercase tracking-widest text-stone-400">Duration</span>
                                  <span className="text-sm font-semibold text-stone-700">{cruise?.duration}</span>
                                </div>
                              </div>
                              <div className="flex items-center gap-3">
                                <UsersRound size={18} className="text-stone-300" />
                                <div>
                                  <span className="block text-[0.6rem] font-bold uppercase tracking-widest text-stone-400">Availability</span>
                                  <span className={cn(
                                    "text-sm font-semibold",
                                    sailing.seatsLeft <= 5 ? "text-orange-600" : "text-stone-700"
                                  )}>
                                    {sailing.seatsLeft} seats left
                                  </span>
                                </div>
                              </div>
                            </div>

                            <Button asChild className="h-16 rounded-full bg-cyan-400 px-10 text-[0.75rem] font-bold uppercase tracking-[0.2em] text-stone-950 hover:bg-cyan-300 border-none shadow-[0_12px_24px_rgba(34,211,238,0.3)] w-full sm:w-auto">
                              <Link
                                href={`/booking/${sailing.id}?${bookingQuery}`}
                                scroll={false}
                              >
                                Select Passage
                                <ArrowRight className="ml-2" size={18} />
                              </Link>
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Reveal>
              )
            })}
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  )
}

function Reveal({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  return (
    <div 
      className="animate-in fade-in slide-in-from-bottom-8 duration-1000 fill-mode-both"
      style={{ animationDelay: `${delay}s` }}
    >
      {children}
    </div>
  )
}
