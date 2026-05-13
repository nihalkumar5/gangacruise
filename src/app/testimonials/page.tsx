import { LuxuryNav } from "@/components/layout/luxury-nav"
import { GlassPanel } from "@/components/luxury/glass-panel"
import { Reveal } from "@/components/luxury/reveal"
import { PageHero } from "@/components/shared/page-hero"
import { SiteFooter } from "@/components/shared/site-footer"

const testimonials = [
  ["It did not feel like a tour. It felt like Varanasi had slowed down for us.", "Aarav Mehta"],
  ["The boarding, the silence, the light. Everything felt considered.", "Mira Kapoor"],
  ["A rare way to host overseas guests without the city feeling overwhelming.", "Devika Rao"],
]

export default function TestimonialsPage() {
  return (
    <>
      <LuxuryNav />
      <main>
        <PageHero
          eyebrow="Guest notes"
          title="Quiet luxury, remembered clearly."
          copy="Reviews from guests who came for the river and stayed with the feeling."
        />
        <section className="pb-28">
          <div className="luxury-shell grid gap-5 lg:grid-cols-3">
            {testimonials.map(([quote, name], index) => (
              <Reveal key={name} delay={index * 0.08}>
                <GlassPanel innerClassName="p-8">
                  <p className="font-display text-3xl leading-tight text-river">“{quote}”</p>
                  <p className="mt-10 text-sm uppercase tracking-[0.22em] text-gold-100/58">
                    {name}
                  </p>
                </GlassPanel>
              </Reveal>
            ))}
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  )
}
