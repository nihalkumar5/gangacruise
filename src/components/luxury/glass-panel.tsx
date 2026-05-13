import type { HTMLAttributes } from "react"

import { cn } from "@/lib/utils"

type GlassPanelProps = HTMLAttributes<HTMLDivElement> & {
  innerClassName?: string
}

export function GlassPanel({
  children,
  className,
  innerClassName,
  ...props
}: GlassPanelProps) {
  return (
    <div
      className={cn(
        "rounded-[2rem] border border-stone-200/80 bg-white/70 p-2 shadow-[0_28px_80px_rgba(68,47,31,0.11)]",
        className,
      )}
      {...props}
    >
      <div
        className={cn(
          "h-full rounded-[calc(2rem-0.5rem)] bg-white/80 shadow-glass-inner",
          innerClassName,
        )}
      >
        {children}
      </div>
    </div>
  )
}
