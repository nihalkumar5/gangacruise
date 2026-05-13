"use client"

import { motion, type HTMLMotionProps, useReducedMotion } from "framer-motion"
import { useEffect, useRef, useState } from "react"

import { motionEasings } from "@/design/motion"
import { cn } from "@/lib/utils"

type RevealProps = HTMLMotionProps<"div"> & {
  delay?: number
}

export function Reveal({
  children,
  className,
  delay = 0,
  ...props
}: RevealProps) {
  const ref = useRef<HTMLDivElement | null>(null)
  const reduceMotion = useReducedMotion()
  const [mounted, setMounted] = useState(false)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    setMounted(true)

    if (reduceMotion) {
      setVisible(true)
      return
    }

    const node = ref.current

    if (!node) {
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          observer.disconnect()
        }
      },
      { rootMargin: "-12% 0px" },
    )

    observer.observe(node)

    return () => observer.disconnect()
  }, [reduceMotion])

  return (
    <motion.div
      ref={ref}
      className={cn(className)}
      initial={false}
      animate={
        !mounted || visible
          ? { opacity: 1, y: 0, filter: "blur(0px)" }
          : { opacity: 0, y: 34, filter: "blur(12px)" }
      }
      transition={{
        duration: 0.86,
        delay,
        ease: motionEasings.silk,
      }}
      {...props}
    >
      {children}
    </motion.div>
  )
}
