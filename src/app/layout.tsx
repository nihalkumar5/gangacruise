import type { Metadata } from "next"
import { Outfit, Plus_Jakarta_Sans, Shadows_Into_Light } from "next/font/google"

import "./globals.css"

const display = Outfit({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["300", "400", "500", "600"],
  display: "swap",
})

const sans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["400", "500", "600", "700"],
  display: "swap",
})

const script = Shadows_Into_Light({
  subsets: ["latin"],
  variable: "--font-script",
  weight: ["400"],
  display: "swap",
})

export const metadata: Metadata = {
  title: "GangaCruise | Luxury River Cruises in Varanasi",
  description:
    "A cinematic luxury booking platform for private and curated Ganga river cruises in Varanasi.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${display.variable} ${sans.variable} ${script.variable}`}
    >
      <body className="font-sans" suppressHydrationWarning>
        <div className="noise-layer" aria-hidden="true" />
        {children}
      </body>
    </html>
  )
}
