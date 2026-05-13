import { LuxuryNav } from "@/components/layout/luxury-nav"
import { PageHero } from "@/components/shared/page-hero"
import { SiteFooter } from "@/components/shared/site-footer"
import InteractiveBentoGallery, {
  type MediaItem,
} from "@/components/ui/interactive-bento-gallery"

const mediaItems: MediaItem[] = [
  {
    id: 1,
    type: "image",
    title: "Dawn deck stillness",
    desc: "First light settling over the river before the city fully wakes.",
    url: "/images/ganga-hero-dawn.png",
    span: "sm:col-span-1 sm:row-span-3 md:col-span-1 md:row-span-3",
    position: "12% 58%",
  },
  {
    id: 2,
    type: "video",
    title: "Cruise approach",
    desc: "A moving river perspective with the deck and waterline in frame.",
    url: "/videos/cruise.mp4",
    span: "col-span-1 sm:col-span-2 sm:row-span-2 md:col-span-2 md:row-span-2",
  },
  {
    id: 3,
    type: "image",
    title: "Evening ceremony glow",
    desc: "Lantern light, river reflections, and a slower atmosphere after sunset.",
    url: "/images/ganga-hero-dawn.png",
    span: "sm:col-span-2 sm:row-span-2 md:col-span-1 md:row-span-3",
    position: "86% 46%",
  },
  {
    id: 4,
    type: "image",
    title: "Private deck details",
    desc: "Composed settings, soft service moments, and restrained luxury.",
    url: "/images/ganga-hero-dawn.png",
    span: "sm:col-span-1 sm:row-span-2 md:col-span-2 md:row-span-2",
    position: "68% 72%",
  },
  {
    id: 5,
    type: "video",
    title: "River motion study",
    desc: "Texture, wake, and metallic reflections during a passing stretch.",
    url: "/videos/hero-download.mp4",
    span: "sm:col-span-1 sm:row-span-2 md:col-span-1 md:row-span-3",
  },
  {
    id: 6,
    type: "image",
    title: "Warm horizon",
    desc: "A wider river frame built around sky, tone, and open breathing room.",
    url: "/images/ganga-hero-dawn.png",
    span: "sm:col-span-2 sm:row-span-2 md:col-span-2 md:row-span-2",
    position: "50% 18%",
  },
  {
    id: 7,
    type: "image",
    title: "Ghat silhouettes",
    desc: "Layered steps, distant prayer smoke, and the city meeting the water.",
    url: "/images/ganga-hero-dawn.png",
    span: "sm:col-span-1 sm:row-span-2 md:col-span-1 md:row-span-3",
    position: "34% 40%",
  },
]

export default function GalleryPage() {
  return (
    <>
      <LuxuryNav />
      <main>
        <PageHero
          eyebrow="Gallery"
          title="A visual river archive."
          copy="A drag-and-open gallery of river light, deck detail, and atmosphere designed to be explored, not just glanced at."
        />
        <section className="pb-28">
          <InteractiveBentoGallery
            mediaItems={mediaItems}
            title="Move through the river in fragments"
            description="Drag the frames to reshuffle the rhythm, open any shot for a full-screen view, and browse the collection through the floating media dock."
          />
        </section>
      </main>
      <SiteFooter />
    </>
  )
}
