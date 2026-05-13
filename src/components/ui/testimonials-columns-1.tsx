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
  isFeatured?: boolean
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
            {props.testimonials.map(({ text, image, name, role, isFeatured }) => (
              <div
                className={cn(
                  "w-full max-w-xs rounded-3xl border p-10 transition-all duration-500",
                  isFeatured 
                    ? "bg-cyan-600 text-white border-cyan-500 shadow-xl shadow-cyan-500/20" 
                    : "bg-white/80 text-foreground border-border shadow-lg shadow-primary/10 backdrop-blur-sm"
                )}
                key={`${name}-${groupIndex}`}
              >
                <div className={cn(
                  "text-sm leading-7",
                  isFeatured ? "text-white/90" : "text-foreground/80"
                )}>
                  {text}
                </div>
                <div className="mt-5 flex items-center gap-3">
                  <Image
                    width={40}
                    height={40}
                    src={image}
                    alt={name}
                    className={cn(
                      "size-10 rounded-full object-cover",
                      isFeatured ? "border-2 border-white/20" : ""
                    )}
                  />
                  <div className="flex flex-col">
                    <div className={cn(
                      "font-medium leading-5 tracking-tight",
                      isFeatured ? "text-white" : "text-foreground"
                    )}>
                      {name}
                    </div>
                    <div className={cn(
                      "leading-5 tracking-tight text-xs uppercase font-bold",
                      isFeatured ? "text-white/60" : "text-muted-foreground"
                    )}>
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
