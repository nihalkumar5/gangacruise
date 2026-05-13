import { Reveal } from "@/components/luxury/reveal"
import { cn } from "@/lib/utils"

type PageHeroProps = {
  eyebrow: string
  title: string
  copy: string
  className?: string
}

export function PageHero({ eyebrow, title, copy, className }: PageHeroProps) {
  return (
    <section className={cn("relative overflow-hidden pt-36 sm:pt-44", className)}>
      <div className="absolute inset-x-0 top-0 h-96 bg-[radial-gradient(circle_at_50%_0%,rgba(172,43,151,.10),transparent_34rem)]" />
      <Reveal className="luxury-shell relative max-w-4xl pb-16">
        <p className="mb-5 text-[0.68rem] font-semibold uppercase tracking-[0.32em] text-gold-100/70">
          {eyebrow}
        </p>
        <h1 className="font-display text-6xl font-medium leading-[0.9] text-river sm:text-8xl">
          {title}
        </h1>
        <p className="mt-8 max-w-2xl text-pretty text-base leading-8 text-river/66 sm:text-lg">
          {copy}
        </p>
      </Reveal>
    </section>
  )
}
