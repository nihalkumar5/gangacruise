"use client"

import * as React from "react"
import { useEffect, useRef, useState } from "react"
import { useGSAP } from "@gsap/react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

import { cn } from "@/lib/utils"

gsap.registerPlugin(ScrollTrigger)

export interface FlowSectionProps {
  className?: string
  style?: React.CSSProperties
  children: React.ReactNode
  "aria-label"?: string
}

export function FlowSection({
  className,
  style = {},
  children,
  "aria-label": ariaLabel,
}: FlowSectionProps) {
  return (
    <section
      data-flow-section
      aria-label={ariaLabel}
      className={cn("relative min-h-screen w-full overflow-hidden", className)}
    >
      <div
        data-flow-inner
        className={cn(
          "flow-art-container relative flex min-h-screen w-full flex-col justify-between gap-6 px-[4vw] pb-[4vw] pt-[clamp(2rem,8vw,4vw)] will-change-transform"
        )}
        style={{ transformOrigin: "bottom left", ...style }}
      >
        {children}
      </div>
    </section>
  )
}

export interface FlowArtProps {
  children: React.ReactNode
  className?: string
  "aria-label"?: string
}

const getChildCount = (children: React.ReactNode) => React.Children.count(children)

export default function FlowArt({
  children,
  className,
  "aria-label": ariaLabel = "Story scroll",
}: FlowArtProps) {
  const containerRef = useRef<HTMLElement>(null)
  const [reducedMotion, setReducedMotion] = useState(false)

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)")
    const update = () => setReducedMotion(mediaQuery.matches)

    update()
    mediaQuery.addEventListener("change", update)

    return () => mediaQuery.removeEventListener("change", update)
  }, [])

  useGSAP(
    () => {
      if (!containerRef.current || reducedMotion) return

      const sections = Array.from(
        containerRef.current.querySelectorAll<HTMLElement>("[data-flow-section]")
      )

      if (sections.length === 0) return

      const triggers: ScrollTrigger[] = []

      sections.forEach((section, index) => {
        gsap.set(section, { zIndex: index + 1 })

        const inner = section.querySelector<HTMLElement>(".flow-art-container")
        if (!inner) return

        if (index > 0) {
          gsap.set(inner, { rotation: 30, transformOrigin: "bottom left" })

          const tween = gsap.to(inner, {
            rotation: 0,
            ease: "none",
            scrollTrigger: {
              trigger: section,
              start: "top bottom",
              end: "top 25%",
              scrub: true,
            },
          })

          if (tween.scrollTrigger) {
            triggers.push(tween.scrollTrigger)
          }
        }

        if (index < sections.length - 1) {
          triggers.push(
            ScrollTrigger.create({
              trigger: section,
              start: "bottom bottom",
              end: "bottom top",
              pin: true,
              pinSpacing: false,
            })
          )
        }
      })

      ScrollTrigger.refresh()

      return () => {
        triggers.forEach((trigger) => trigger.kill())
      }
    },
    { scope: containerRef, dependencies: [getChildCount(children), reducedMotion] }
  )

  return (
    <main
      ref={containerRef}
      aria-label={ariaLabel}
      className={cn("w-full overflow-x-hidden", className)}
    >
      {children}
    </main>
  )
}
