import { ArrowUpRight } from "lucide-react"
import type { ComponentPropsWithoutRef } from "react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type LuxuryButtonProps = ComponentPropsWithoutRef<typeof Button> & {
  icon?: boolean
}

export function LuxuryButton({
  children,
  className,
  icon = true,
  ...props
}: LuxuryButtonProps) {
  return (
    <Button className={cn("h-14 pl-7 pr-3", className)} {...props}>
      <span>{children}</span>
      {icon ? (
        <span className="grid size-9 place-items-center rounded-full bg-obsidian/8 text-obsidian transition-transform duration-500 ease-glass group-hover/button:translate-x-0.5 group-hover/button:-translate-y-0.5 group-hover/button:scale-105">
          <ArrowUpRight data-icon="inline-end" strokeWidth={1.4} />
        </span>
      ) : null}
    </Button>
  )
}
