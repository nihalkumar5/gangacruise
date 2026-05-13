import type { ReactNode } from "react"

import { cn } from "@/lib/utils"

type StatusBadgeProps = {
  children: ReactNode
  tone?: "gold" | "success" | "danger" | "muted"
}

export function StatusBadge({ children, tone = "gold" }: StatusBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex rounded-full px-3 py-1 text-[0.62rem] font-semibold uppercase tracking-[0.22em] ring-1",
        tone === "gold" && "bg-gold-300/10 text-gold-100 ring-gold-300/24",
        tone === "success" && "bg-emerald-400/10 text-emerald-200 ring-emerald-300/20",
        tone === "danger" && "bg-red-400/10 text-red-200 ring-red-300/20",
        tone === "muted" && "bg-white/5 text-river/58 ring-white/10",
      )}
    >
      {children}
    </span>
  )
}
