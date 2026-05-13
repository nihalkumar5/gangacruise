"use client"

import Link from "next/link"
import Image from "next/image"
import { AnimatePresence, motion } from "framer-motion"
import { Heart, Menu, X, ArrowRight } from "lucide-react"
import { useEffect, useState } from "react"

import { cn } from "@/lib/utils"

const navItems = [
  { label: "Our Story", href: "/our-story" },
  { label: "Cruises", href: "/cruises" },
  { label: "Gallery", href: "/gallery" },
  { label: "Reviews", href: "/testimonials" },
  { label: "Private Events", href: "/group-booking" },
  { label: "Account", href: "/account" },
]

const eventOptions = [
  { 
    label: "Wedding", 
    image: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=1200&q=80",
    description: "Ceremonies on the sacred river with tailored hospitality."
  },
  { 
    label: "Birthday Party", 
    image: "https://images.unsplash.com/photo-1464347601390-2ff68d8f5f9a?auto=format&fit=crop&w=1200&q=80",
    description: "Celebrate milestones with cinematic sunset views."
  },
  { 
    label: "Ring Ceremony", 
    image: "https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?auto=format&fit=crop&w=1200&q=80",
    description: "Exquisite decks for intimate family gatherings."
  },
  { 
    label: "Anniversary", 
    image: "https://images.unsplash.com/photo-1522673607200-164883efbfc1?auto=format&fit=crop&w=1200&q=80",
    description: "Rediscover love amidst the timeless flow of Ganga."
  },
  { 
    label: "Satsang/Katha", 
    image: "https://images.unsplash.com/photo-1561361058-c24cecae35ca?auto=format&fit=crop&w=1200&q=80",
    description: "Spiritual gatherings in a serene, private environment."
  },
  { 
    label: "Business Meeting", 
    image: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=1200&q=80",
    description: "Composed executive settings for founders and partners."
  }
]

export function LuxuryNav() {
  const [open, setOpen] = useState(false)
  const [eventsOpen, setEventsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [hoveredEvent, setHoveredEvent] = useState<string | null>(null)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    if (eventsOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
    }
    return () => {
      document.body.style.overflow = "unset"
    }
  }, [eventsOpen])

  return (
    <>
      <motion.header
        className="nav-reveal fixed left-0 right-0 top-0 z-50 px-4 pt-4 transition-all duration-500"
      >
        <nav
          className={cn(
            "mx-auto flex w-full max-w-[92%] items-center justify-between rounded-full border transition-all duration-700",
            scrolled 
              ? "border-white/20 bg-stone-950/80 px-6 py-1.5 shadow-[0_8px_32px_rgba(0,0,0,0.5)] backdrop-blur-xl" 
              : "border-white/10 bg-stone-950/50 px-8 py-2.5 backdrop-blur-md shadow-[0_4px_24px_rgba(0,0,0,0.15)]"
          )}
        >
          <Link
            href="/"
            className="flex items-center gap-2.5 rounded-full pl-1 pr-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
            aria-label="GangaCruise home"
          >
            <span className={cn(
              "grid place-items-center rounded-full border border-white/30 bg-white/10 font-display text-white transition-all duration-500",
              scrolled ? "size-6 text-sm" : "size-8 text-lg"
            )}>
              G
            </span>
            <span className={cn(
              "font-semibold tracking-[0.2em] text-white transition-all duration-500",
              scrolled ? "text-[0.72rem]" : "text-[0.82rem]"
            )}>
              GANGACRUISE
            </span>
          </Link>

          <div className="hidden items-center gap-1 md:flex">
            {navItems.map((item) => (
              item.label === "Private Events" ? (
                <button
                  key={item.href}
                  onClick={() => setEventsOpen(true)}
                  className={cn(
                    "flex items-center gap-1.5 rounded-full px-5 py-2 font-semibold uppercase tracking-[0.18em] text-white transition-all duration-500 hover:bg-white/10",
                    scrolled ? "text-[0.68rem]" : "text-[0.72rem]"
                  )}
                >
                  {item.label}
                  <span className="inline-block border-x-[3px] border-t-[4px] border-x-transparent border-t-white/60" />
                </button>
              ) : (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "rounded-full px-5 py-2 font-semibold uppercase tracking-[0.18em] text-white transition-all duration-500 hover:bg-white/10",
                    scrolled ? "text-[0.68rem]" : "text-[0.72rem]"
                  )}
                >
                  {item.label}
                </Link>
              )
            ))}
          </div>

          <Link
            href="/booking"
            className={cn(
              "group hidden items-center justify-center rounded-full bg-cyan-300 px-8 py-3 text-[0.72rem] font-bold uppercase tracking-[0.18em] text-stone-900 shadow-[0_8px_24px_rgba(103,232,249,0.3)] transition-all duration-500 hover:scale-[1.02] hover:bg-cyan-200 active:scale-95 md:inline-flex",
              scrolled ? "scale-90" : "scale-100"
            )}
          >
            Reserve
          </Link>

          <div className="flex items-center gap-2 md:hidden">
            <button
              className="grid size-9 place-items-center rounded-full border border-white/20 bg-white/10 text-white"
              type="button"
              aria-label="Wishlist"
            >
              <Heart size={18} strokeWidth={1.5} />
            </button>
            <button
              className="grid size-9 place-items-center rounded-full border border-white/20 bg-white/10 text-white"
              type="button"
              onClick={() => setOpen((value) => !value)}
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
            >
              {open ? <X size={20} strokeWidth={1.5} /> : <Menu size={20} strokeWidth={1.5} />}
            </button>
          </div>
        </nav>
      </motion.header>

      {/* Full-Screen Events Mega Menu */}
      <AnimatePresence>
        {eventsOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-[100] flex flex-col bg-stone-950 px-8 py-16 md:px-20 lg:py-24"
          >
            {/* Background Image Effect */}
            <AnimatePresence mode="wait">
              <motion.div
                key={hoveredEvent || "default"}
                initial={{ opacity: 0, scale: 1.1 }}
                animate={{ opacity: 0.5, scale: 1 }}
                exit={{ opacity: 0, scale: 1.1 }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="absolute inset-0 z-0 pointer-events-none"
              >
                <Image 
                  src={hoveredEvent 
                    ? eventOptions.find(e => e.label === hoveredEvent)?.image || ""
                    : "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1920&q=80"
                  }
                  alt={hoveredEvent || "Private Events Background"}
                  fill
                  className="object-cover"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/70 to-stone-950/30" />
              </motion.div>
            </AnimatePresence>

            {/* Header */}
            <div className="relative z-10 flex items-center justify-between border-b border-white/10 pb-8 sm:pb-12">
              <div>
                <p className="text-[0.6rem] font-bold uppercase tracking-[0.4em] text-cyan-400">Exquisite Gatherings</p>
                <h2 className="mt-2 font-display text-4xl font-medium text-white sm:text-6xl lg:text-7xl">Private Events</h2>
              </div>
              <button 
                onClick={() => setEventsOpen(false)}
                className="grid size-12 place-items-center rounded-full border border-white/20 bg-white/5 text-white transition-all duration-500 hover:bg-white/20 hover:scale-110 active:scale-95 sm:size-16"
              >
                <X size={28} strokeWidth={1.2} className="sm:hidden" />
                <X size={32} strokeWidth={1.2} className="hidden sm:block" />
              </button>
            </div>

            {/* Event Grid */}
            <div className="relative z-10 mt-8 grid flex-1 gap-x-12 overflow-hidden lg:mt-16 lg:grid-cols-2">
              <div className="flex flex-col justify-center gap-1 overflow-y-auto pr-4 scrollbar-hide sm:gap-2">
                {eventOptions.map((event, idx) => (
                  <motion.div
                    key={event.label}
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 + idx * 0.05 }}
                  >
                    <Link
                      href={`/group-booking?type=${event.label.toLowerCase().replace(/ /g, "-")}`}
                      onClick={() => setEventsOpen(false)}
                      onMouseEnter={() => setHoveredEvent(event.label)}
                      onMouseLeave={() => setHoveredEvent(null)}
                      className="group flex items-center gap-4 py-2 transition-all duration-500 sm:gap-6 sm:py-3"
                    >
                      <span className="text-[0.65rem] font-mono text-white/30 group-hover:text-cyan-400 sm:text-xs">0{idx + 1}</span>
                      <span className="font-display text-3xl font-medium text-white/50 transition-all duration-500 group-hover:text-white group-hover:translate-x-4 sm:text-5xl lg:text-6xl">
                        {event.label}
                      </span>
                      <ArrowRight className="h-5 w-5 opacity-0 transition-all duration-500 group-hover:opacity-100 group-hover:translate-x-6 text-cyan-400 sm:h-6 sm:w-6" />
                    </Link>
                  </motion.div>
                ))}
              </div>

              {/* Description Panel (Desktop only) */}
              <div className="hidden flex-col justify-center pb-12 lg:flex">
                <AnimatePresence mode="wait">
                  {hoveredEvent ? (
                    <motion.div
                      key={hoveredEvent}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="max-w-md"
                    >
                      <div className="mb-6 overflow-hidden rounded-2xl border border-white/10 shadow-2xl">
                        <div className="relative aspect-[16/10] w-full">
                          <Image 
                            src={eventOptions.find(e => e.label === hoveredEvent)?.image || ""}
                            alt={hoveredEvent}
                            fill
                            className="object-cover"
                          />
                        </div>
                      </div>
                      <p className="text-2xl font-medium leading-relaxed text-white/80">
                        {eventOptions.find(e => e.label === hoveredEvent)?.description}
                      </p>
                      <div className="mt-8 h-px w-20 bg-cyan-400" />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="default"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="max-w-md"
                    >
                      <p className="text-2xl font-medium leading-relaxed text-white/30 italic">
                        Select an event type to explore our curated hosting experiences on the river.
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Footer */}
            <div className="relative z-10 mt-auto flex flex-col gap-6 border-t border-white/10 pt-8 sm:flex-row sm:items-center sm:justify-between sm:pt-10">
              <div className="flex gap-8 sm:gap-10">
                <div>
                  <span className="block text-[0.55rem] font-bold uppercase tracking-widest text-white/40 sm:text-[0.6rem]">Inquiries</span>
                  <p className="mt-1 text-xs font-semibold text-white sm:text-sm">+91 98765 43210</p>
                </div>
                <div>
                  <span className="block text-[0.55rem] font-bold uppercase tracking-widest text-white/40 sm:text-[0.6rem]">Email</span>
                  <p className="mt-1 text-xs font-semibold text-white sm:text-sm">events@gangacruise.com</p>
                </div>
              </div>
              <Link href="/group-booking" className="inline-flex h-11 items-center justify-center gap-3 rounded-full bg-cyan-300 px-6 text-[0.6rem] font-bold uppercase tracking-[0.2em] text-stone-900 transition-all hover:bg-cyan-200 sm:h-12 sm:px-8 sm:text-[0.65rem]">
                Book Full Deck
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {open ? (
          <motion.div
            className="fixed inset-0 z-[60] flex flex-col bg-[#0ea5e9]/95 px-8 pt-24 backdrop-blur-2xl md:hidden"
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="flex flex-1 flex-col items-start gap-6 pt-8">
              {navItems.map((item, idx) => (
                <motion.div
                  key={item.href}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 + idx * 0.1, duration: 0.5 }}
                  className="w-full"
                >
                  <Link
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className="block text-3xl font-bold tracking-tight text-white/90 transition-colors hover:text-white"
                  >
                    {item.label}
                  </Link>
                  {item.label === "Private Events" && (
                    <div className="mt-4 flex flex-col gap-3 pl-4 border-l border-white/20">
                      {eventOptions.map((subItem) => (
                        <Link
                          key={subItem.label}
                          href={`/group-booking?type=${subItem.label.toLowerCase().replace(/ /g, "-")}`}
                          onClick={() => setOpen(false)}
                          className="text-sm font-semibold uppercase tracking-[0.2em] text-white/60 hover:text-white"
                        >
                          {subItem.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </motion.div>
              ))}
            </div>

            <div className="border-t border-white/20 pb-12 pt-8 text-white/80">
              <div className="space-y-4">
                <div>
                  <span className="block text-[0.65rem] font-bold uppercase tracking-widest opacity-60">Call us</span>
                  <p className="text-lg font-medium">+91 98765 43210</p>
                </div>
                <div>
                  <span className="block text-[0.65rem] font-bold uppercase tracking-widest opacity-60">Email</span>
                  <p className="text-lg font-medium">sail@gangacruise.com</p>
                </div>
                <div>
                  <span className="block text-[0.65rem] font-bold uppercase tracking-widest opacity-60">Working Hours</span>
                  <p className="text-sm">8am - 10pm IST</p>
                </div>
              </div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  )
}
