import type { Metadata } from "next"

import { OurStoryPage } from "@/features/marketing/components/our-story-page"

export const metadata: Metadata = {
  title: "Our Story | GangaCruise",
  description:
    "Discover the story behind GangaCruise and how our river journeys in Varanasi were designed around quiet luxury, reverence, and hosted detail.",
}

export default function Page() {
  return <OurStoryPage />
}
