import Image from "next/image"
import Link from "next/link"
import { ArrowRight, Clock3, UsersRound } from "lucide-react"

import { GlassPanel } from "@/components/luxury/glass-panel"
import { StatusBadge } from "@/components/shared/status-badge"
import { Button } from "@/components/ui/button"
import { type Cruise, formatPrice } from "@/lib/data/cruises"

type CruiseCardProps = {
  cruise: Cruise
  priority?: boolean
}

export function CruiseCard({ cruise, priority = false }: CruiseCardProps) {
  return (
    <GlassPanel className="card-light-sweep relative overflow-hidden" innerClassName="p-0">
      <Link href={`/cruises/${cruise.slug}`} className="group block">
        <div className="relative aspect-[16/11] overflow-hidden rounded-t-[calc(2rem-0.5rem)]">
          <Image
            src="/images/ganga-hero-dawn.png"
            alt={cruise.title}
            fill
            priority={priority}
            sizes="(min-width: 1024px) 33vw, 100vw"
            className="object-cover transition-transform duration-1000 ease-glass group-hover:scale-[1.045]"
            style={{ objectPosition: cruise.imagePosition }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/78 via-black/10 to-transparent" />
          <div className="absolute left-5 top-5">
            <StatusBadge>{cruise.mood}</StatusBadge>
          </div>
        </div>
        <div className="p-7">
          <div className="flex flex-wrap items-center gap-3 text-xs uppercase tracking-[0.2em] text-river/48">
            <span className="inline-flex items-center gap-2">
              <Clock3 strokeWidth={1.3} />
              {cruise.duration}
            </span>
            <span className="inline-flex items-center gap-2">
              <UsersRound strokeWidth={1.3} />
              {cruise.seatsLeft} seats left
            </span>
          </div>
          <h2 className="mt-6 font-display text-4xl font-medium leading-none text-river">
            {cruise.title}
          </h2>
          <p className="mt-4 min-h-16 text-sm leading-7 text-river/60">
            {cruise.subtitle}
          </p>
          <div className="mt-8 flex items-center justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-river/38">From</p>
              <p className="mt-1 text-lg font-medium text-river">
                {formatPrice(cruise.price)}
              </p>
            </div>
            <Button size="sm" variant="ghost">
              View
              <ArrowRight data-icon="inline-end" strokeWidth={1.4} />
            </Button>
          </div>
        </div>
      </Link>
    </GlassPanel>
  )
}
