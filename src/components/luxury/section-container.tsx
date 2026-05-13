import type { HTMLAttributes } from "react"

import { cn } from "@/lib/utils"

export function SectionContainer({
  children,
  className,
  ...props
}: HTMLAttributes<HTMLElement>) {
  return (
    <section className={cn("py-24 sm:py-36", className)} {...props}>
      <div className="luxury-shell">{children}</div>
    </section>
  )
}
