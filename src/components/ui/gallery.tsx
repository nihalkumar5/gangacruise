"use client"

import Link from "next/link"
import { useEffect, useState, type MouseEvent } from "react"
import { motion, useMotionValue } from "framer-motion"
import Image, { type ImageProps } from "next/image"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type Direction = "left" | "right"

type PhotoItem = {
  id: number
  order: number
  x: string
  y: string
  zIndex: number
  direction: Direction
  src: string
  alt: string
}

const photos: PhotoItem[] = [
  {
    id: 1,
    order: 0,
    x: "-420px",
    y: "18px",
    zIndex: 50,
    direction: "left",
    src: "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&w=900&q=80",
    alt: "Guests enjoying a boat ride at sunrise on the river",
  },
  {
    id: 2,
    order: 1,
    x: "-210px",
    y: "34px",
    zIndex: 40,
    direction: "left",
    src: "https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=900&q=80",
    alt: "Soft river light and open water in the early morning",
  },
  {
    id: 3,
    order: 2,
    x: "0px",
    y: "8px",
    zIndex: 30,
    direction: "right",
    src: "https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&w=900&q=80",
    alt: "Deck seating arranged for a calm luxury river departure",
  },
  {
    id: 4,
    order: 3,
    x: "210px",
    y: "24px",
    zIndex: 20,
    direction: "right",
    src: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=900&q=80",
    alt: "Golden light over a reflective water surface",
  },
  {
    id: 5,
    order: 4,
    x: "420px",
    y: "44px",
    zIndex: 10,
    direction: "left",
    src: "https://images.unsplash.com/photo-1518837695005-2083093ee35b?auto=format&fit=crop&w=900&q=80",
    alt: "A quiet travel moment framed by open sky and water",
  },
]

export function PhotoGallery({ animationDelay = 0.5 }: { animationDelay?: number }) {
  const [isVisible, setIsVisible] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    const visibilityTimer = window.setTimeout(() => {
      setIsVisible(true)
    }, animationDelay * 1000)

    const animationTimer = window.setTimeout(
      () => {
        setIsLoaded(true)
      },
      (animationDelay + 0.4) * 1000,
    )

    return () => {
      window.clearTimeout(visibilityTimer)
      window.clearTimeout(animationTimer)
    }
  }, [animationDelay])

  const containerVariants = {
    hidden: { opacity: 1 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1,
      },
    },
  }

  const photoVariants = {
    hidden: () => ({
      x: 0,
      y: 0,
      rotate: 0,
      scale: 1,
    }),
    visible: (custom: { x: string; y: string; order: number }) => ({
      x: custom.x,
      y: custom.y,
      rotate: 0,
      scale: 1,
      transition: {
        type: "spring" as const,
        stiffness: 70,
        damping: 12,
        mass: 1,
        delay: custom.order * 0.15,
      },
    }),
  }

  return (
    <div className="relative">
      <div className="absolute inset-x-0 top-[220px] -z-10 hidden h-[400px] bg-[linear-gradient(to_right,rgba(87,83,78,.5)_1px,transparent_1px),linear-gradient(to_bottom,rgba(87,83,78,.5)_1px,transparent_1px)] bg-[size:3rem_3rem] opacity-20 [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)] md:block" />

      <p className="my-2 text-center text-[0.68rem] font-semibold uppercase tracking-[0.32em] text-cyan-600/80">
        A Journey Through Visual Stories
      </p>
      <h3 className="mx-auto max-w-4xl py-3 text-center font-display text-5xl leading-[0.95] text-river sm:text-6xl lg:text-7xl">
        Welcome to Our <span className="text-cyan-600">River Stories</span>
      </h3>
      <p className="mx-auto mt-4 max-w-2xl text-center text-base leading-8 text-river/60">
        A collage of hosted mornings, warm light, quiet ceremony, and the kind of
        details guests remember long after the cruise ends.
      </p>

      <div className="relative mb-12 mt-16 flex h-[320px] w-full items-start justify-center overflow-hidden sm:h-[400px] lg:h-[480px]">
        <motion.div
          className="relative mx-auto flex w-full max-w-7xl justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: isVisible ? 1 : 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          <motion.div
            className="relative flex w-full justify-center"
            variants={containerVariants}
            initial="hidden"
            animate={isLoaded ? "visible" : "hidden"}
          >
            <div className="relative h-[280px] w-[280px] origin-top scale-[0.52] sm:scale-[0.72] lg:scale-100">
              {[...photos].reverse().map((photo) => (
                <motion.div
                  key={photo.id}
                  className="absolute left-0 top-0"
                  style={{ zIndex: photo.zIndex }}
                  variants={photoVariants}
                  custom={{
                    x: photo.x,
                    y: photo.y,
                    order: photo.order,
                  }}
                >
                  <Photo
                    width={280}
                    height={280}
                    src={photo.src}
                    alt={photo.alt}
                    direction={photo.direction}
                  />
                </motion.div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>

      <div className="flex w-full justify-center">
        <Button asChild className="h-14 px-8 bg-cyan-400 hover:bg-cyan-300 text-stone-950 border-none shadow-[0_8px_24px_rgba(34,211,238,0.3)]">
          <Link href="/gallery">View All Stories</Link>
        </Button>
      </div>
    </div>
  )
}

function getRandomNumberInRange(min: number, max: number) {
  if (min >= max) {
    throw new Error("Min value should be less than max value")
  }

  return Math.random() * (max - min) + min
}

export function Photo({
  src,
  alt,
  className,
  direction = "left",
  width,
  height,
  ...props
}: {
  className?: string
  direction?: Direction
} & Pick<ImageProps, "src" | "alt" | "width" | "height">) {
  const [rotation, setRotation] = useState(0)
  const x = useMotionValue(200)
  const y = useMotionValue(200)

  useEffect(() => {
    const randomRotation =
      getRandomNumberInRange(1, 4) * (direction === "left" ? -1 : 1)
    setRotation(randomRotation)
  }, [direction])

  function handleMouse(event: MouseEvent<HTMLDivElement>) {
    const rect = event.currentTarget.getBoundingClientRect()
    x.set(event.clientX - rect.left)
    y.set(event.clientY - rect.top)
  }

  function resetMouse() {
    x.set(200)
    y.set(200)
  }

  return (
    <motion.div
      drag
      dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
      whileTap={{ scale: 1.25, zIndex: 10000 }}
      whileHover={{
        scale: 1.2,
        rotateZ: 4 * (direction === "left" ? -1 : 1),
        zIndex: 10000,
        transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] }
      }}
      whileDrag={{
        scale: 1.2,
        zIndex: 10000,
      }}
      initial={{ rotate: 0 }}
      animate={{ rotate: rotation }}
      style={{
        width,
        height,
        perspective: 400,
        transform: "rotate(0deg) rotateX(0deg) rotateY(0deg)",
        zIndex: 1,
        WebkitTouchCallout: "none",
        WebkitUserSelect: "none",
        userSelect: "none",
        touchAction: "none",
      }}
      className={cn(
        "relative mx-auto shrink-0 cursor-grab active:cursor-grabbing",
        className,
      )}
      onMouseMove={handleMouse}
      onMouseLeave={resetMouse}
      draggable={false}
      tabIndex={0}
    >
      <div className="relative h-full w-full overflow-hidden rounded-[2.5rem] shadow-[0_24px_80px_rgba(39,34,31,0.22)] border border-white/20">
        <Image
          className="rounded-[2.5rem] object-cover transition-transform duration-700 group-hover:scale-110"
          fill
          src={src}
          alt={alt}
          sizes="280px"
          draggable={false}
          {...props}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
      </div>
    </motion.div>
  )
}
