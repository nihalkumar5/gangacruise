"use client"

import Image from "next/image"
import React from "react"
import { motion } from "motion/react"

import { cn } from "@/lib/utils"

export type Testimonial = {
  text: string
  image: string
  name: string
  role: string
}

export function TestimonialsColumn(props: {
  className?: string
  testimonials: readonly Testimonial[]
  duration?: number
}) {
  return (
    <div className={props.className}>
      <motion.div
        animate={{
          translateY: "-50%",
        }}
        transition={{
          duration: props.duration || 10,
          repeat: Infinity,
          ease: "linear",
          repeatType: "loop",
        }}
        className="flex flex-col gap-6 bg-background pb-6"
      >
        {Array.from({ length: 2 }).map((_, groupIndex) => (
          <React.Fragment key={groupIndex}>
            {props.testimonials.map(({ text, image, name, role }) => (
              <div
                className={cn(
                  "w-full max-w-xs rounded-3xl border border-border bg-white/80 p-10 shadow-lg shadow-primary/10",
                  "backdrop-blur-sm",
                )}
                key={`${name}-${groupIndex}`}
              >
                <div className="text-sm leading-7 text-foreground/80">{text}</div>
                <div className="mt-5 flex items-center gap-2">
                  <Image
                    width={40}
                    height={40}
                    src={image}
                    alt={name}
                    className="size-10 rounded-full object-cover"
                  />
                  <div className="flex flex-col">
                    <div className="font-medium leading-5 tracking-tight text-foreground">
                      {name}
                    </div>
                    <div className="leading-5 tracking-tight text-muted-foreground">
                      {role}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </React.Fragment>
        ))}
      </motion.div>
    </div>
  )
}
