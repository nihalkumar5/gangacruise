"use client"

import { useRouter } from "next/navigation"
import { format } from "date-fns"
import { motion, useReducedMotion } from "framer-motion"
import { CalendarDays, MapPin, Search, UsersRound } from "lucide-react"
import { useEffect, useRef, useState } from "react"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { saveSearchSnapshot } from "@/features/booking/lib/booking-state"

const PHRASES = ["sacred river", "ancient ganga", "eternal kashi", "mystic waters"]

export function CinematicHero() {
  const currentYear = new Date().getFullYear()
  const router = useRouter()
  const [activeWordIndex, setActiveWordIndex] = useState(0)
  const [displayText, setDisplayText] = useState("")
  const [isDeleting, setIsDeleting] = useState(false)
  const [date, setDate] = useState<string>("2026-05-13")
  const [draftDate, setDraftDate] = useState<string>("2026-05-13")
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false)
  const typingSpeed = isDeleting ? 40 : 80

  useEffect(() => {
    const handleTyping = () => {
      const currentPhrase = PHRASES[activeWordIndex]
      
      if (!isDeleting) {
        setDisplayText(currentPhrase.substring(0, displayText.length + 1))
        if (displayText.length === currentPhrase.length) {
          setTimeout(() => setIsDeleting(true), 2000)
        }
      } else {
        setDisplayText(currentPhrase.substring(0, displayText.length - 1))
        if (displayText.length === 0) {
          setIsDeleting(false)
          setActiveWordIndex((prev) => (prev + 1) % PHRASES.length)
        }
      }
    }

    const timer = setTimeout(handleTyping, typingSpeed)
    return () => clearTimeout(timer)
  }, [displayText, isDeleting, activeWordIndex, typingSpeed])

  const rootRef = useRef<HTMLElement | null>(null)
  const mediaRef = useRef<HTMLDivElement | null>(null)
  const copyRef = useRef<HTMLDivElement | null>(null)
  const reduceMotion = useReducedMotion()
  const [location, setLocation] = useState("Varanasi")
  const [guests, setGuests] = useState(2)

  function handleDatePickerOpenChange(nextOpen: boolean) {
    if (nextOpen) {
      setDraftDate(date)
    }

    setIsDatePickerOpen(nextOpen)
  }

  function handleDateConfirm() {
    setDate(draftDate)
    setIsDatePickerOpen(false)
  }

  function handleDateCancel() {
    setDraftDate(date)
    setIsDatePickerOpen(false)
  }

  useEffect(() => {
    if (reduceMotion) {
      return
    }

    let context: { revert: () => void } | undefined

    async function run() {
      const gsapModule = await import("gsap")
      const scrollTriggerModule = await import("gsap/ScrollTrigger")
      const gsap = gsapModule.gsap
      const ScrollTrigger = scrollTriggerModule.ScrollTrigger

      gsap.registerPlugin(ScrollTrigger)

      context = gsap.context(() => {
        gsap
          .timeline({
            scrollTrigger: {
              trigger: rootRef.current,
              start: "top top",
              end: "bottom top",
              scrub: 0.9,
              invalidateOnRefresh: true,
            },
          })
          .to(mediaRef.current, { scale: 1.035, yPercent: 5, ease: "none" }, 0)
          .to(copyRef.current, { yPercent: -8, opacity: 0.86, ease: "none" }, 0)
      }, rootRef)
    }

    run()

    return () => context?.revert()
  }, [reduceMotion])

  function submitSearch() {
    const formattedDate = date
    const snapshot = { location, date: formattedDate, guests }
    const params = new URLSearchParams({
      location,
      date: formattedDate,
      guests: String(guests),
    })

    saveSearchSnapshot(snapshot)
    router.push(`/booking?${params.toString()}`, { scroll: false })
  }

  return (
    <section
      ref={rootRef}
      className="relative isolate overflow-hidden bg-stone-900"
    >
      <div className="relative min-h-screen w-full overflow-hidden sm:min-h-[100svh]">
        <div ref={mediaRef} className="absolute inset-0 scale-100 will-change-transform">
          <video
            aria-hidden="true"
            autoPlay={!reduceMotion}
            className="h-full w-full object-cover"
            loop={!reduceMotion}
            muted
            playsInline
            poster="/images/ganga-hero-dawn.png"
            preload="auto"
          >
            <source src="/videos/cruise.mp4" type="video/mp4" />
          </video>
        </div>

        <div className="absolute inset-0 bg-black/30" />
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/50 to-transparent" />

        <div
          ref={copyRef}
          className="relative z-10 flex min-h-screen flex-col items-center justify-start px-6 pb-24 pt-36 text-center sm:justify-center sm:pb-48 sm:pt-32"
        >


          <motion.h1 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-5xl text-balance font-display text-[clamp(2.9rem,11vw,7.5rem)] font-bold leading-[0.95] tracking-tight text-white"
          >
            Sail the <br />
            <span className="relative inline-block text-cyan-300">
              {displayText}
              <motion.span
                animate={{ opacity: [1, 0] }}
                transition={{ duration: 0.5, repeat: Infinity, ease: "linear" }}
                className="ml-1 inline-block h-[0.8em] w-[4px] bg-white/60 align-middle"
              />
            </span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 1.5 }}
            className="mt-10 max-w-xl text-pretty text-[1.05rem] font-medium leading-relaxed text-stone-200/90 [text-shadow:0_2px_20px_rgba(0,0,0,0.5)] sm:text-[1.25rem]"
          >
            Experience Varanasi through its most sacred artery. <br />
            Private journeys composed around dawn light and silence.
          </motion.p>

          <div className="hero-reveal-late mt-10 flex w-full justify-center px-4 sm:absolute sm:inset-x-0 sm:bottom-28 sm:mt-0 sm:px-6">
            <div className="flex w-full max-w-sm flex-col items-stretch gap-2 rounded-2xl border border-white/10 bg-stone-950/60 p-2 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.6)] backdrop-blur-2xl sm:max-w-fit sm:flex-row sm:items-center">
              <label className="group flex items-center gap-4 px-5 py-3 text-left transition hover:bg-white/5 sm:px-7 sm:py-3.5">
                <MapPin className="size-5 text-cyan-300/60 transition-colors group-hover:text-cyan-300" />
                <div className="min-w-0">
                  <span className="block text-[0.6rem] font-bold uppercase tracking-widest text-white/40 sm:text-[0.65rem]">
                    Location
                  </span>
                  <select
                    className="block w-full bg-transparent text-[0.9rem] font-bold text-white focus:outline-none sm:text-[1rem]"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                  >
                    <option className="bg-stone-900" value="Varanasi">Varanasi</option>
                    <option className="bg-stone-900" value="Assi Ghat">Assi Ghat</option>
                    <option className="bg-stone-900" value="Dashashwamedh Ghat">Dashashwamedh Ghat</option>
                  </select>
                </div>
              </label>

              <div className="hidden h-10 w-px bg-white/10 sm:block" />

              <Popover open={isDatePickerOpen} onOpenChange={handleDatePickerOpenChange}>
                <PopoverTrigger asChild>
                  <button className="group flex flex-1 items-center gap-4 px-5 py-3 text-left transition hover:bg-white/5 sm:px-7 sm:py-3.5">
                    <CalendarDays className="size-5 text-cyan-300/60 transition-colors group-hover:text-cyan-300" />
                    <div className="min-w-0">
                      <span className="block text-[0.6rem] font-bold uppercase tracking-widest text-white/40 sm:text-[0.65rem]">
                        Journey Date
                      </span>
                      <span className="block text-[0.9rem] font-bold text-white sm:text-[1rem]">
                        {date ? format(new Date(date), "dd/MM/yyyy") : "Select Date"}
                      </span>
                    </div>
                  </button>
                </PopoverTrigger>
                <PopoverContent
                  align="start"
                  className="min-w-0 overflow-hidden rounded-[1.75rem] border-white/12 bg-[linear-gradient(180deg,rgba(15,23,32,0.96),rgba(28,34,43,0.92))] p-0 shadow-[0_28px_90px_-28px_rgba(0,0,0,0.9)] backdrop-blur-2xl w-[min(19rem,calc(100vw-1.5rem))]"
                >
                  <Calendar
                    captionLayout="dropdown"
                    hideNavigation
                    mode="single"
                    showOutsideDays={false}
                    startMonth={new Date(currentYear, 0)}
                    endMonth={new Date(currentYear + 2, 11)}
                    selected={new Date(draftDate)}
                    onSelect={(d) => d && setDraftDate(format(d, "yyyy-MM-dd"))}
                  />
                  <div className="flex items-center justify-end gap-2 border-t border-white/10 bg-black/10 px-3 py-3">
                    <button
                      type="button"
                      onClick={handleDateCancel}
                      className="grid h-10 min-w-[5.5rem] place-items-center rounded-xl border border-white/10 bg-white/[0.03] px-4 text-sm font-semibold text-white/72 transition hover:bg-white/[0.06] hover:text-white"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleDateConfirm}
                      className="grid h-10 min-w-[5.5rem] place-items-center rounded-xl bg-cyan-300 px-4 text-sm font-semibold text-slate-950 transition hover:bg-cyan-200"
                    >
                      Done
                    </button>
                  </div>
                </PopoverContent>
              </Popover>

              <div className="hidden h-10 w-px bg-white/10 sm:block" />

              <div className="group flex items-center gap-4 px-5 py-3 text-left transition hover:bg-white/5 sm:px-7 sm:py-3.5">
                <UsersRound className="size-5 text-cyan-300/60 transition-colors group-hover:text-cyan-300" />
                <div className="min-w-0">
                  <span className="block text-[0.6rem] font-bold uppercase tracking-widest text-white/40 sm:text-[0.65rem]">
                    Travelers
                  </span>
                  <div className="mt-0.5 flex items-center gap-4 text-[0.9rem] font-bold text-white sm:text-[1rem]">
                    <button
                      type="button"
                      onClick={() => setGuests((v) => Math.max(v - 1, 1))}
                      className="grid size-6 place-items-center rounded-full border border-white/10 bg-white/5 text-white transition hover:bg-white/15 sm:size-7"
                    >
                      -
                    </button>
                    <span className="min-w-[1.2rem] text-center">{guests}</span>
                    <button
                      type="button"
                      onClick={() => setGuests((v) => Math.min(v + 1, 12))}
                      className="grid size-6 place-items-center rounded-full border border-white/10 bg-white/5 text-white transition hover:bg-white/15 sm:size-7"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              <Button
                className="group/button relative isolate h-14 w-full overflow-hidden rounded-[1.35rem] border border-white/12 bg-[linear-gradient(135deg,#67e8f9_0%,#34d7f3_42%,#0ea5cf_100%)] p-0 text-slate-950 shadow-[0_20px_45px_-18px_rgba(52,215,243,0.95),0_12px_28px_-16px_rgba(0,0,0,0.7)] transition duration-500 hover:-translate-y-0.5 hover:shadow-[0_26px_60px_-18px_rgba(103,232,249,0.9),0_18px_36px_-18px_rgba(0,0,0,0.82)] active:translate-y-0 active:scale-[0.98] sm:size-16 sm:w-16"
                type="button"
                aria-label="Search"
                onClick={submitSearch}
              >
                <div className="absolute inset-[1px] rounded-[calc(1.35rem-1px)] bg-[linear-gradient(180deg,rgba(255,255,255,0.18),rgba(255,255,255,0.02)_42%,rgba(0,0,0,0.1)_100%)]" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_28%_24%,rgba(255,255,255,0.26),transparent_34%),linear-gradient(140deg,transparent_22%,rgba(255,255,255,0.15)_48%,transparent_74%)] opacity-80 transition duration-500 group-hover/button:opacity-100" />
                <div className="absolute inset-y-0 left-[-60%] w-[70%] rotate-12 bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-0 blur-md transition duration-700 group-hover/button:left-[115%] group-hover/button:opacity-100" />
                <div className="absolute inset-x-3 bottom-1.5 h-6 rounded-full bg-cyan-950/25 blur-xl transition duration-500 group-hover/button:bg-cyan-950/35" />
                <Search
                  size={24}
                  strokeWidth={2.6}
                  className="relative z-10 transition duration-500 group-hover/button:scale-110 group-hover/button:-translate-y-0.5 sm:size-26"
                />
              </Button>
            </div>
          </div>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6, y: [0, 8, 0] }}
            transition={{ 
              opacity: { duration: 1, delay: 2 },
              y: { duration: 2, repeat: Infinity, ease: "easeInOut" }
            }}
            className="absolute bottom-6 flex flex-col items-center gap-3 sm:bottom-6"
          >
            <span className="text-[0.55rem] font-bold uppercase tracking-[0.6em] text-white">Scroll</span>
            <div className="h-8 w-px bg-gradient-to-b from-cyan-300 to-transparent" />
          </motion.div>
        </div>
      </div>
    </section>
  )
}
