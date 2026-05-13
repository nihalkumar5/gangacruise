import Link from "next/link"
import { Facebook, Github, Instagram, Mail, MapPin, Phone, Twitter } from "lucide-react"

const data = {
  facebookLink: "https://facebook.com/",
  instaLink: "https://instagram.com/",
  twitterLink: "https://twitter.com/",
  githubLink: "https://github.com/",
  services: {
    story: "/our-story",
    cruises: "/cruises",
    gallery: "/gallery",
    events: "/group-booking",
  },
  about: {
    story: "/our-story",
    reviews: "/testimonials",
    account: "/account",
    careers: "/agent",
  },
  help: {
    booking: "/booking",
    support: "/account",
    livechat: "/group-booking",
  },
  contact: {
    email: "sail@gangacruise.com",
    phone: "+91 98765 43210",
    address: "Varanasi, Uttar Pradesh, India",
  },
  company: {
    name: "GangaCruise",
    description:
      "Luxury river journeys in Varanasi, designed around light, quiet, and ceremony. We create hosted departures and private river events with a cinematic, guest-first experience.",
  },
}

const socialLinks = [
  { icon: Facebook, label: "Facebook", href: data.facebookLink },
  { icon: Instagram, label: "Instagram", href: data.instaLink },
  { icon: Twitter, label: "Twitter", href: data.twitterLink },
  { icon: Github, label: "GitHub", href: data.githubLink },
]

const aboutLinks = [
  { text: "Our Story", href: data.about.story },
  { text: "Reviews", href: data.about.reviews },
  { text: "Guest Account", href: data.about.account },
  { text: "Partner With Us", href: data.about.careers },
]

const serviceLinks = [
  { text: "Curated Cruises", href: data.services.cruises },
  { text: "Private Events", href: data.services.events },
  { text: "River Gallery", href: data.services.gallery },
  { text: "Brand Story", href: data.services.story },
]

const helpfulLinks = [
  { text: "Reserve Now", href: data.help.booking },
  { text: "Guest Support", href: data.help.support },
  { text: "Plan an Event", href: data.help.livechat, hasIndicator: true },
]

const mobileQuickLinks = [
  { text: "Reserve", href: data.help.booking },
  { text: "Cruises", href: data.services.cruises },
  { text: "Gallery", href: data.services.gallery },
  { text: "Events", href: data.services.events },
]

const contactInfo = [
  { icon: Mail, text: data.contact.email, href: `mailto:${data.contact.email}` },
  {
    icon: Phone,
    text: data.contact.phone,
    href: `tel:${data.contact.phone.replace(/\s+/g, "")}`,
  },
  {
    icon: MapPin,
    text: data.contact.address,
    href: "https://maps.google.com/?q=Varanasi%2C%20Uttar%20Pradesh%2C%20India",
    isAddress: true,
  },
]

export default function Footer4Col() {
  return (
    <footer className="mt-12 w-full place-self-end rounded-t-[1.5rem] border-t border-white/10 bg-[linear-gradient(180deg,#08131b_0%,#050a0f_100%)] text-white sm:mt-20 sm:rounded-t-[2rem]">
      <div className="mx-auto max-w-screen-xl px-4 pb-5 pt-8 sm:px-6 sm:pb-6 sm:pt-16 lg:px-8 lg:pt-20">
        <div className="sm:hidden">
          <div className="flex items-center justify-between gap-4">
            <Link
              href="/"
              className="flex min-w-0 items-center gap-3"
              aria-label="GangaCruise home"
            >
              <span className="grid size-9 shrink-0 place-items-center rounded-full border border-white/18 bg-cyan-300/10 font-display text-base text-white">
                G
              </span>
              <span className="truncate text-lg font-semibold tracking-[0.08em]">
                {data.company.name}
              </span>
            </Link>

            <ul className="flex shrink-0 gap-2">
              {socialLinks.slice(0, 3).map(({ icon: Icon, label, href }) => (
                <li key={label}>
                  <Link
                    href={href}
                    target="_blank"
                    rel="noreferrer"
                    className="grid size-9 place-items-center rounded-full border border-white/10 bg-white/5 text-cyan-200"
                  >
                    <span className="sr-only">{label}</span>
                    <Icon className="size-4" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <p className="mt-4 text-sm leading-6 text-white/60">
            Luxury river journeys in Varanasi, hosted around light, ceremony, and calm.
          </p>

          <nav
            aria-label="Mobile footer navigation"
            className="mt-5 grid grid-cols-2 gap-2"
          >
            {mobileQuickLinks.map(({ text, href }) => (
              <Link
                key={text}
                href={href}
                className="rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2.5 text-center text-xs font-bold uppercase tracking-[0.16em] text-white/72"
              >
                {text}
              </Link>
            ))}
          </nav>

          <div className="mt-5 grid gap-2 text-sm">
            {contactInfo.slice(0, 2).map(({ icon: Icon, text, href }) => (
              <Link
                key={text}
                href={href}
                className="flex items-center gap-2.5 rounded-xl bg-white/[0.04] px-3 py-2.5 text-white/62"
              >
                <Icon className="size-4 shrink-0 text-cyan-300" />
                <span className="min-w-0 truncate">{text}</span>
              </Link>
            ))}
          </div>
        </div>

        <div className="hidden grid-cols-1 gap-10 sm:grid lg:grid-cols-[1.05fr_1.95fr]">
          <div>
            <div className="flex justify-center gap-3 sm:justify-start">
              <span className="grid h-10 w-10 place-items-center rounded-full border border-white/18 bg-cyan-300/10 font-display text-lg text-white">
                G
              </span>
              <span className="pt-1 text-2xl font-semibold tracking-[0.08em]">
                {data.company.name}
              </span>
            </div>

            <p className="mt-6 max-w-md text-center text-sm leading-7 text-white/58 sm:max-w-sm sm:text-left">
              {data.company.description}
            </p>

            <ul className="mt-8 flex justify-center gap-4 sm:justify-start md:gap-5">
              {socialLinks.map(({ icon: Icon, label, href }) => (
                <li key={label}>
                  <Link
                    href={href}
                    target="_blank"
                    rel="noreferrer"
                    className="grid h-10 w-10 place-items-center rounded-full border border-white/10 bg-white/5 text-cyan-200 transition hover:-translate-y-0.5 hover:border-cyan-300/30 hover:bg-cyan-300/10 hover:text-cyan-100"
                  >
                    <span className="sr-only">{label}</span>
                    <Icon className="size-4.5" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 md:grid-cols-4">
            <div className="text-center sm:text-left">
              <p className="text-lg font-medium text-white">About Us</p>
              <ul className="mt-6 space-y-3 text-sm">
                {aboutLinks.map(({ text, href }) => (
                  <li key={text}>
                    <Link
                      className="text-white/58 transition hover:text-white"
                      href={href}
                    >
                      {text}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="text-center sm:text-left">
              <p className="text-lg font-medium text-white">Experiences</p>
              <ul className="mt-6 space-y-3 text-sm">
                {serviceLinks.map(({ text, href }) => (
                  <li key={text}>
                    <Link
                      className="text-white/58 transition hover:text-white"
                      href={href}
                    >
                      {text}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="text-center sm:text-left">
              <p className="text-lg font-medium text-white">Helpful Links</p>
              <ul className="mt-6 space-y-3 text-sm">
                {helpfulLinks.map(({ text, href, hasIndicator }) => (
                  <li key={text}>
                    <Link
                      href={href}
                      className={
                        hasIndicator
                          ? "group inline-flex items-center justify-center gap-2 sm:justify-start"
                          : "text-white/58 transition hover:text-white"
                      }
                    >
                      <span className="text-white/58 transition group-hover:text-white">
                        {text}
                      </span>
                      {hasIndicator ? (
                        <span className="relative flex size-2">
                          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-300 opacity-75" />
                          <span className="relative inline-flex size-2 rounded-full bg-cyan-300" />
                        </span>
                      ) : null}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="text-center sm:text-left">
              <p className="text-lg font-medium text-white">Contact Us</p>
              <ul className="mt-6 space-y-4 text-sm">
                {contactInfo.map(({ icon: Icon, text, href, isAddress }) => (
                  <li key={text}>
                    <Link
                      className="flex items-start justify-center gap-2.5 sm:justify-start"
                      href={href}
                      target={isAddress ? "_blank" : undefined}
                      rel={isAddress ? "noreferrer" : undefined}
                    >
                      <Icon className="mt-0.5 size-4.5 shrink-0 text-cyan-300" />
                      {isAddress ? (
                        <address className="flex-1 not-italic text-white/58 transition hover:text-white">
                          {text}
                        </address>
                      ) : (
                        <span className="flex-1 text-white/58 transition hover:text-white">
                          {text}
                        </span>
                      )}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-6 border-t border-white/10 pt-4 sm:mt-12 sm:pt-6">
          <div className="flex items-center justify-between gap-3 sm:text-left">
            <p className="min-w-0 truncate pl-14 text-xs text-white/52 sm:pl-0 sm:text-sm">
              All rights reserved.
            </p>
            <p className="shrink-0 text-xs text-white/42 sm:order-first sm:text-sm">
              &copy; 2026 {data.company.name}
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
