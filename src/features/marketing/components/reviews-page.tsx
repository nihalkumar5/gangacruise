"use client"
import { motion } from "framer-motion"
import { LuxuryNav } from "@/components/layout/luxury-nav"
import { SiteFooter } from "@/components/shared/site-footer"
import { TestimonialsColumn } from "@/components/ui/testimonials-columns-1"

const testimonials = [
  {
    text: "The cruise felt perfectly timed around the light. Boarding was calm, the seats were ready, and the team made the whole morning feel effortless.",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=160&q=80",
    name: "Aarav Mehta",
    role: "Dawn cruise guest",
    isFeatured: true,
  },
  {
    text: "We booked for visiting family and everything was handled with a rare amount of grace. The river view during aarti was unforgettable.",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=160&q=80",
    name: "Mira Kapoor",
    role: "Evening aarti guest",
  },
  {
    text: "The private deck had exactly the right mood for our celebration. Quiet service, clear communication, and no crowding.",
    image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=160&q=80",
    name: "Naina Shah",
    role: "Private charter host",
  },
  {
    text: "Seat selection and checkout were simple, but the experience still felt premium from the first message to boarding.",
    image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=160&q=80",
    name: "Kabir Sethi",
    role: "Weekend guest",
  },
  {
    text: "Our guide knew when to speak and when to let the river do the work. That restraint made the whole trip feel special.",
    image: "https://images.unsplash.com/photo-1554151228-14d9def656e4?auto=format&fit=crop&w=160&q=80",
    name: "Leela Rao",
    role: "Story cruise guest",
    isFeatured: true,
  },
  {
    text: "The team coordinated our group without making it feel managed. Everyone simply arrived, settled in, and enjoyed the evening.",
    image: "https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?auto=format&fit=crop&w=160&q=80",
    name: "Rohan Bansal",
    role: "Group booking lead",
  },
  {
    text: "The ticket and reminders made planning easy. On the boat, the details were polished without becoming formal.",
    image: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=160&q=80",
    name: "Anika Sen",
    role: "Sunrise guest",
  },
  {
    text: "I wanted something peaceful for my parents, and this was exactly that. Slow, beautiful, and very thoughtfully hosted.",
    image: "https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?auto=format&fit=crop&w=160&q=80",
    name: "Dev Malhotra",
    role: "Family host",
    isFeatured: true,
  },
  {
    text: "The boat never felt rushed. From tea to the final return, every touchpoint had a sense of care.",
    image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=160&q=80",
    name: "Sara Thomas",
    role: "Private evening guest",
  },
]

const firstColumn = testimonials.slice(0, 3)
const secondColumn = testimonials.slice(3, 6)
const thirdColumn = testimonials.slice(6, 9)

export function ReviewsPage() {
  return (
    <>
      <LuxuryNav />
      <main className="bg-background pt-32">
        <section className="relative overflow-hidden py-24 sm:py-32">
          <div className="luxury-shell relative">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="mx-auto flex max-w-[800px] flex-col items-center justify-center text-center"
            >
              <div className="rounded-lg border border-border bg-white/70 px-4 py-1.5 text-[0.65rem] font-bold uppercase tracking-[0.2em] text-cyan-600 shadow-sm">
                Guest Journal
              </div>

              <h1 className="mt-8 font-display text-6xl font-medium leading-[0.95] text-river sm:text-8xl">
                The River <br /> Reflections
              </h1>
              <p className="mt-8 max-w-2xl text-lg leading-8 text-river/65">
                Every journey on the Ganga tells a different story. Here are the experiences 
                and memories shared by our guests from across the world.
              </p>
            </motion.div>

            <div className="mt-20 flex min-h-[800px] justify-center gap-6 overflow-hidden">
              <TestimonialsColumn testimonials={firstColumn} duration={25} />
              <TestimonialsColumn
                testimonials={secondColumn}
                className="hidden md:block"
                duration={30}
              />
              <TestimonialsColumn
                testimonials={thirdColumn}
                className="hidden lg:block"
                duration={28}
              />
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  )
}
