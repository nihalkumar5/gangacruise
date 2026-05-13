"use client"

import { useEffect, useRef, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { X } from "lucide-react"

import { cn } from "@/lib/utils"

export interface MediaItem {
  id: number
  type: "image" | "video"
  title: string
  desc: string
  url: string
  span: string
  position?: string
}

const MediaTile = ({
  item,
  className,
  onClick,
}: {
  item: MediaItem
  className?: string
  onClick?: () => void
}) => {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isInView, setIsInView] = useState(false)
  const [isBuffering, setIsBuffering] = useState(item.type === "video")

  useEffect(() => {
    if (item.type !== "video") return

    const node = videoRef.current
    if (!node) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setIsInView(entry.isIntersecting)
        })
      },
      { root: null, rootMargin: "50px", threshold: 0.1 }
    )

    observer.observe(node)

    return () => {
      observer.unobserve(node)
      observer.disconnect()
    }
  }, [item.type])

  useEffect(() => {
    if (item.type !== "video") return

    let mounted = true
    const node = videoRef.current

    const handleVideoPlay = async () => {
      if (!videoRef.current || !isInView || !mounted) return

      try {
        if (videoRef.current.readyState >= 3) {
          setIsBuffering(false)
          await videoRef.current.play()
          return
        }

        setIsBuffering(true)
        await new Promise<void>((resolve) => {
          const node = videoRef.current
          if (!node) {
            resolve()
            return
          }

          node.oncanplay = () => resolve()
        })

        if (mounted && videoRef.current) {
          setIsBuffering(false)
          await videoRef.current.play()
        }
      } catch (error) {
        console.warn("Video playback failed:", error)
      }
    }

    if (isInView) {
      handleVideoPlay()
    } else if (videoRef.current) {
      videoRef.current.pause()
    }

    return () => {
      mounted = false
      if (node) {
        node.pause()
      }
    }
  }, [isInView, item.type])

  if (item.type === "video") {
    return (
      <div className={cn(className, "relative overflow-hidden")}>
        <video
          ref={videoRef}
          className="h-full w-full object-cover"
          onClick={onClick}
          playsInline
          muted
          loop
          preload="auto"
          style={{
            opacity: isBuffering ? 0.82 : 1,
            transition: "opacity 0.2s",
            transform: "translateZ(0)",
            willChange: "transform",
            objectPosition: item.position ?? "center",
          }}
        >
          <source src={item.url} type="video/mp4" />
        </video>
        {isBuffering ? (
          <div className="absolute inset-0 flex items-center justify-center bg-[#07151c]/16">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-white/30 border-t-white" />
          </div>
        ) : null}
      </div>
    )
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={item.url}
      alt={item.title}
      className={cn(className, "cursor-pointer object-cover")}
      style={{ objectPosition: item.position ?? "center" }}
      onClick={onClick}
      loading="lazy"
      decoding="async"
    />
  )
}

interface GalleryModalProps {
  selectedItem: MediaItem
  isOpen: boolean
  onClose: () => void
  setSelectedItem: (item: MediaItem | null) => void
  mediaItems: MediaItem[]
}

const GalleryModal = ({
  selectedItem,
  isOpen,
  onClose,
  setSelectedItem,
  mediaItems,
}: GalleryModalProps) => {
  const [dockPosition, setDockPosition] = useState({ x: 0, y: 0 })

  if (!isOpen) return null

  return (
    <>
      <motion.div
        className="fixed inset-0 z-40 bg-[#061119]/78 backdrop-blur-2xl"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      />

      <motion.div
        initial={{ scale: 0.985, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.985, opacity: 0 }}
        transition={{ type: "spring", stiffness: 380, damping: 30 }}
        className="fixed inset-x-3 top-3 z-50 h-[calc(100dvh-6rem)] overflow-hidden rounded-[2rem] border border-white/14 bg-[linear-gradient(180deg,rgba(15,27,34,0.96),rgba(10,16,22,0.96))] shadow-[0_40px_120px_rgba(0,0,0,0.42)] sm:inset-x-8 sm:top-8 sm:h-[calc(100dvh-9rem)]"
      >
        <div className="flex h-full flex-col">
          <div className="flex-1 p-3 sm:p-5">
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedItem.id}
                className="relative mx-auto flex h-full max-h-[72vh] w-full max-w-5xl items-center justify-center overflow-hidden rounded-[1.7rem] border border-white/10 bg-black/20"
                initial={{ y: 20, scale: 0.97 }}
                animate={{
                  y: 0,
                  scale: 1,
                  transition: {
                    type: "spring",
                    stiffness: 460,
                    damping: 30,
                    mass: 0.55,
                  },
                }}
                exit={{ y: 20, scale: 0.97, transition: { duration: 0.15 } }}
              >
                <MediaTile
                  item={selectedItem}
                  className="h-full w-full object-contain bg-[#061119]"
                  onClick={onClose}
                />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/72 via-black/28 to-transparent p-4 sm:p-6">
                  <h3 className="text-lg font-semibold text-white sm:text-2xl">
                    {selectedItem.title}
                  </h3>
                  <p className="mt-2 max-w-2xl text-sm leading-6 text-white/72 sm:text-base">
                    {selectedItem.desc}
                  </p>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        <motion.button
          className="absolute right-3 top-3 grid h-10 w-10 place-items-center rounded-full border border-white/10 bg-white/75 text-[#061119] backdrop-blur-sm transition hover:bg-white sm:right-5 sm:top-5"
          onClick={onClose}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.92 }}
        >
          <X className="h-4 w-4" />
        </motion.button>
      </motion.div>

      <motion.div
        drag
        dragMomentum={false}
        dragElastic={0.1}
        initial={false}
        animate={{ x: dockPosition.x, y: dockPosition.y }}
        onDragEnd={(_, info) => {
          setDockPosition((prev) => ({
            x: prev.x + info.offset.x,
            y: prev.y + info.offset.y,
          }))
        }}
        className="fixed bottom-4 left-1/2 z-[60] -translate-x-1/2 touch-none"
      >
        <motion.div className="relative rounded-2xl border border-cyan-300/24 bg-cyan-300/12 shadow-[0_22px_70px_rgba(0,0,0,0.26)] backdrop-blur-xl">
          <div className="flex items-center -space-x-2 px-3 py-2">
            {mediaItems.map((item, index) => (
              <motion.div
                key={item.id}
                onClick={(event) => {
                  event.stopPropagation()
                  setSelectedItem(item)
                }}
                style={{
                  zIndex: selectedItem.id === item.id ? 30 : mediaItems.length - index,
                }}
                className={cn(
                  "group relative h-9 w-9 flex-shrink-0 cursor-pointer overflow-hidden rounded-xl sm:h-10 sm:w-10",
                  selectedItem.id === item.id
                    ? "ring-2 ring-white/72 shadow-lg"
                    : "hover:ring-2 hover:ring-white/30"
                )}
                initial={{ rotate: index % 2 === 0 ? -15 : 15 }}
                animate={{
                  scale: selectedItem.id === item.id ? 1.18 : 1,
                  rotate: selectedItem.id === item.id ? 0 : index % 2 === 0 ? -15 : 15,
                  y: selectedItem.id === item.id ? -8 : 0,
                }}
                whileHover={{
                  scale: 1.28,
                  rotate: 0,
                  y: -10,
                  transition: { type: "spring", stiffness: 400, damping: 25 },
                }}
              >
                <MediaTile item={item} className="h-full w-full" />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/5 to-white/20" />
                {selectedItem.id === item.id ? (
                  <motion.div
                    layoutId="activeGlow"
                    className="absolute -inset-2 bg-white/20 blur-xl"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.2 }}
                  />
                ) : null}
              </motion.div>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </>
  )
}

interface InteractiveBentoGalleryProps {
  mediaItems: MediaItem[]
  title: string
  description: string
}

export default function InteractiveBentoGallery({
  mediaItems,
  title,
  description,
}: InteractiveBentoGalleryProps) {
  const [selectedItem, setSelectedItem] = useState<MediaItem | null>(null)
  const [items, setItems] = useState(mediaItems)
  const [isDragging, setIsDragging] = useState(false)

  return (
    <div className="luxury-shell max-w-6xl px-0 py-2">
      <div className="mb-12 text-center">
        <motion.h2
          className="font-display text-5xl font-medium leading-[0.92] text-river sm:text-7xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {title}
        </motion.h2>
        <motion.p
          className="mx-auto mt-4 max-w-2xl text-base leading-8 text-river/62 sm:text-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          {description}
        </motion.p>
      </div>

      <AnimatePresence mode="wait">
        {selectedItem ? (
          <GalleryModal
            selectedItem={selectedItem}
            isOpen
            onClose={() => setSelectedItem(null)}
            setSelectedItem={setSelectedItem}
            mediaItems={items}
          />
        ) : (
          <motion.div
            className="grid auto-rows-[80px] grid-cols-1 gap-3 sm:grid-cols-3 md:grid-cols-4"
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: { staggerChildren: 0.08 },
              },
            }}
          >
            {items.map((item, index) => (
              <motion.div
                key={item.id}
                layoutId={`media-${item.id}`}
                className={cn(
                  "relative cursor-move overflow-hidden rounded-[1.7rem] border border-white/55 bg-white shadow-[0_24px_70px_rgba(69,45,28,0.08)]",
                  item.span
                )}
                onClick={() => !isDragging && setSelectedItem(item)}
                variants={{
                  hidden: { y: 50, scale: 0.9, opacity: 0 },
                  visible: {
                    y: 0,
                    scale: 1,
                    opacity: 1,
                    transition: {
                      type: "spring",
                      stiffness: 350,
                      damping: 24,
                      delay: index * 0.04,
                    },
                  },
                }}
                whileHover={{ scale: 1.015 }}
                drag
                dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
                dragElastic={1}
                onDragStart={() => setIsDragging(true)}
                onDragEnd={(_, info) => {
                  setIsDragging(false)
                  const moveDistance = info.offset.x + info.offset.y

                  if (Math.abs(moveDistance) > 50) {
                    const newItems = [...items]
                    const draggedItem = newItems[index]
                    const targetIndex =
                      moveDistance > 0
                        ? Math.min(index + 1, items.length - 1)
                        : Math.max(index - 1, 0)

                    newItems.splice(index, 1)
                    newItems.splice(targetIndex, 0, draggedItem)
                    setItems(newItems)
                  }
                }}
              >
                <MediaTile
                  item={item}
                  className="absolute inset-0 h-full w-full"
                  onClick={() => !isDragging && setSelectedItem(item)}
                />

                <motion.div
                  className="absolute inset-0 flex flex-col justify-end p-3 sm:p-4"
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-black/82 via-black/32 to-transparent" />
                  <h3 className="relative line-clamp-1 text-sm font-medium text-white sm:text-base">
                    {item.title}
                  </h3>
                  <p className="relative mt-1 line-clamp-2 text-xs text-white/72 sm:text-sm">
                    {item.desc}
                  </p>
                </motion.div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
