"use client"

import Link from "next/link"
import { AnimatePresence, motion } from "framer-motion"
import { Heart, Menu, X } from "lucide-react"
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

export function LuxuryNav() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

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
                <div key={item.href} className="group relative">
                  <button
                    className={cn(
                      "flex items-center gap-1.5 rounded-full px-5 py-2 font-semibold uppercase tracking-[0.18em] text-white transition-all duration-500 hover:bg-white/10",
                      scrolled ? "text-[0.68rem]" : "text-[0.72rem]"
                    )}
                  >
                    {item.label}
                    <motion.span
                      animate={{ rotate: 0 }}
                      className="inline-block border-x-4 border-t-4 border-x-transparent border-t-white/60"
                    />
                  </button>
                  
                  {/* Dropdown Menu */}
                  <div className="invisible absolute left-1/2 top-full min-w-[240px] -translate-x-1/2 pt-4 opacity-0 transition-all duration-300 group-hover:visible group-hover:opacity-100">
                    <div className="overflow-hidden rounded-2xl border border-white/10 bg-stone-900/90 p-2 shadow-2xl backdrop-blur-2xl">
                      {[
                        "Wedding",
                        "Birthday Party",
                        "Ring Ceremony",
                        "Anniversary Celebration",
                        "Satsang/Katha",
                        "Business Meeting / Seminar",
                        "Other events"
                      ].map((option) => (
                        <Link
                          key={option}
                          href={`/group-booking?type=${option.toLowerCase().replace(/ /g, "-")}`}
                          className="block rounded-xl px-4 py-3 text-[0.65rem] font-bold uppercase tracking-widest text-white/70 transition-colors hover:bg-white/10 hover:text-white"
                        >
                          {option}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
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
                      {[
                        "Wedding",
                        "Birthday Party",
                        "Ring Ceremony",
                        "Anniversary Celebration",
                        "Satsang/Katha",
                        "Business Meeting / Seminar",
                        "Other events"
                      ].map((subItem) => (
                        <Link
                          key={subItem}
                          href={`/group-booking?type=${subItem.toLowerCase().replace(/ /g, "-")}`}
                          onClick={() => setOpen(false)}
                          className="text-sm font-semibold uppercase tracking-[0.2em] text-white/60 hover:text-white"
                        >
                          {subItem}
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
