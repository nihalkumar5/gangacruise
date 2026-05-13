import { ArrowRight, Calendar, Users, MapPin, Sparkles } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { LuxuryNav } from "@/components/layout/luxury-nav";
import { SiteFooter } from "@/components/shared/site-footer";
import { Button } from "@/components/ui/button";

const eventDetails = {
  wedding: {
    title: "Royal Ganga Wedding",
    description: "Exchange your vows on the sacred waters of the Ganges. Our luxury decks provide a breathtaking backdrop for a ceremony that blends tradition with modern opulence. From floral mandaps to gourmet catering, every detail is orchestrated to perfection.",
    image: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=1920&q=80",
    features: ["Mandap at Sunset", "Heritage Decor", "Custom Menu", "80-120 Guests"],
    highlight: "Cinematic river ceremony with full deck exclusivity."
  },
  "birthday-party": {
    title: "Starlight Birthday",
    description: "Celebrate your milestone with a private deck party under the Varanasi stars. Featuring live music, curated cocktails, and a personalized dining experience as you cruise past the illuminated ghats.",
    image: "/images/events/birthday-party.png",
    features: ["Live Jazz/Sufi", "Signature Cocktails", "Themed Decor", "30-60 Guests"],
    highlight: "Exclusive night cruise with premium hospitality."
  },
  "ring-ceremony": {
    title: "Eternal Promises",
    description: "An intimate setting for your special commitment. Our mid-sized decks offer the perfect balance of privacy and grandeur for a ring ceremony that your family will cherish forever.",
    image: "https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?auto=format&fit=crop&w=1920&q=80",
    features: ["Intimate Deck", "Floral Accents", "Traditional Snacks", "20-40 Guests"],
    highlight: "Private family gathering during the golden hour."
  },
  anniversary: {
    title: "Timeless Love",
    description: "Rediscover the magic of your journey together. A private dinner cruise tailored for couples or small families, featuring personalized service and a serene passage through the heart of Varanasi.",
    image: "https://images.unsplash.com/photo-1522673607200-164883efbfc1?auto=format&fit=crop&w=1920&q=80",
    features: ["Candlelight Dinner", "Solo Musician", "Sparkling Wine", "2-15 Guests"],
    highlight: "Bespoke romantic journey with personalized service."
  },
  "satsang-katha": {
    title: "Sacred Gatherings",
    description: "Experience spiritual bliss in a serene environment. Our quiet decks are perfect for Satsangs and Kathas, providing a peaceful space away from the city's hustle, right on the holy river.",
    image: "https://images.unsplash.com/photo-1561361058-c24cecae35ca?auto=format&fit=crop&w=1920&q=80",
    features: ["Silent Deck", "Sound System", "Sattvic Catering", "50-100 Guests"],
    highlight: "Spiritual tranquility in a private river setting."
  },
  "business-meeting": {
    title: "Executive Passage",
    description: "Step away from the boardroom and onto the river. Our executive decks provide a composed and private environment for strategic discussions, partner meetings, and high-level networking.",
    image: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=1920&q=80",
    features: ["AV Support", "Executive Lunch", "Wi-Fi Access", "10-25 Guests"],
    highlight: "Composed professional environment with a river view."
  },
  "pre-wedding": {
    title: "Ganga Romance Shoot",
    description: "Capture your love story against the most iconic backdrop in India. Our cruises offer exclusive access to prime photography spots during the magical blue and golden hours.",
    image: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1920&q=80",
    features: ["Changing Suites", "Multiple Decks", "Best Light Paths", "Crew Support"],
    highlight: "Uninterrupted access to the river's best angles."
  },
  "corporate-retreat": {
    title: "The River Retreat",
    description: "Foster team spirit in an unconventional setting. A full-day or half-day cruise designed for team bonding, featuring workshops, team activities, and premium leisure.",
    image: "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1920&q=80",
    features: ["Workshops", "Fun Activities", "Full Day Cruise", "40-80 Guests"],
    highlight: "A refreshing departure from traditional offsites."
  },
  "spiritual-retreat": {
    title: "Mindfulness Mist",
    description: "Reconnect with your inner self. Yoga, meditation, and mindfulness sessions conducted as the morning mist rises from the Ganges, led by expert practitioners.",
    image: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=1920&q=80",
    features: ["Yoga Mats", "Meditation Space", "Organic Juices", "20-50 Guests"],
    highlight: "Inner peace in the holy river's morning embrace."
  }
};

export default async function EventPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const event = eventDetails[slug as keyof typeof eventDetails];

  if (!event) {
    notFound();
  }

  return (
    <div className="flex min-h-screen flex-col bg-[#fbf8f4]">
      <LuxuryNav />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative h-[85vh] w-full overflow-hidden">
          <Image
            src={event.image}
            alt={event.title}
            fill
            priority
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent opacity-80" />
          
          <div className="absolute inset-0 flex items-end pb-20">
            <div className="luxury-shell">
              <div className="max-w-3xl">
                <p className="mb-6 inline-flex items-center gap-2 rounded-full bg-cyan-400/20 px-4 py-1.5 text-[0.65rem] font-bold uppercase tracking-[0.2em] text-cyan-300 backdrop-blur-md border border-cyan-400/30">
                  <Sparkles size={14} />
                  Private Hosting
                </p>
                <h1 className="font-display text-7xl font-medium leading-[0.9] text-white sm:text-9xl">
                  {event.title}
                </h1>
              </div>
            </div>
          </div>
        </section>

        {/* Content Section */}
        <section className="py-24 sm:py-32">
          <div className="luxury-shell grid gap-16 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="space-y-10">
              <div>
                <h2 className="font-display text-4xl font-medium text-stone-900 sm:text-5xl">The Experience</h2>
                <p className="mt-8 text-xl leading-relaxed text-stone-600">
                  {event.description}
                </p>
              </div>

              <div className="grid gap-6 sm:grid-cols-2">
                {event.features.map((feature, idx) => (
                  <div key={idx} className="flex items-center gap-4 rounded-2xl border border-stone-200 bg-white p-6 shadow-sm transition-all hover:border-cyan-200 hover:shadow-md">
                    <div className="grid size-10 place-items-center rounded-full bg-cyan-50 text-cyan-600">
                      <Sparkles size={18} />
                    </div>
                    <span className="font-medium text-stone-800">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-8">
              <div className="rounded-[2.5rem] bg-stone-900 p-10 text-white shadow-2xl">
                <h3 className="font-display text-3xl font-medium">Host your event</h3>
                <p className="mt-4 text-stone-400">
                  Start your journey by selecting a date and reserving your private deck passage.
                </p>

                <div className="mt-10 space-y-6">
                  <div className="flex items-center gap-4 text-sm text-stone-300">
                    <Calendar className="text-cyan-400" size={20} />
                    Live Availability
                  </div>
                  <div className="flex items-center gap-4 text-sm text-stone-300">
                    <Users className="text-cyan-400" size={20} />
                    Full Deck Exclusivity
                  </div>
                  <div className="flex items-center gap-4 text-sm text-stone-300">
                    <MapPin className="text-cyan-400" size={20} />
                    Prime Varanasi Ghats
                  </div>
                </div>

                <Button asChild className="mt-12 h-16 w-full rounded-full bg-cyan-400 text-[0.75rem] font-bold uppercase tracking-[0.2em] text-stone-950 hover:bg-cyan-300 border-none shadow-[0_12px_24px_rgba(34,211,238,0.3)]">
                  <Link href="/booking">
                    Start Reservation
                    <ArrowRight size={18} />
                  </Link>
                </Button>
              </div>

              <div className="rounded-[2.5rem] border border-stone-200 bg-white p-10 shadow-sm">
                <h4 className="text-[0.65rem] font-bold uppercase tracking-[0.2em] text-stone-400">Highlight</h4>
                <p className="mt-4 text-lg font-medium leading-relaxed text-stone-800 italic">
                  &ldquo;{event.highlight}&rdquo;
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
