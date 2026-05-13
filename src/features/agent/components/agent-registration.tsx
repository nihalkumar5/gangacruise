import { ArrowRight, BadgePercent, Handshake, ShieldCheck } from "lucide-react"

import { GlassPanel } from "@/components/luxury/glass-panel"
import { StatusBadge } from "@/components/shared/status-badge"
import { Button } from "@/components/ui/button"

const benefits = [
  {
    icon: BadgePercent,
    title: "Commission rules",
    copy: "Tiered agent commissions with payout-ready booking attribution.",
  },
  {
    icon: Handshake,
    title: "Concierge handoff",
    copy: "Private group requests move into a managed event pipeline.",
  },
  {
    icon: ShieldCheck,
    title: "Protected access",
    copy: "Agent views use scoped policies and masked customer data.",
  },
]

export function AgentRegistration() {
  return (
    <div className="luxury-shell grid gap-5 lg:grid-cols-[1fr_26rem]">
      <GlassPanel innerClassName="p-8">
        <StatusBadge>Partner access</StatusBadge>
        <h2 className="mt-5 font-display text-5xl text-river">
          Register as a trusted river partner.
        </h2>
        <div className="mt-8 grid gap-3">
          {["Agency name", "Primary contact", "Email", "WhatsApp number"].map(
            (field) => (
              <input
                key={field}
                placeholder={field}
                className="h-14 rounded-2xl border border-stone-200 bg-white px-4 py-4 text-sm text-river outline-none transition focus:border-lotus/45"
              />
            ),
          )}
          <textarea
            placeholder="Typical guest profile or event volume"
            className="min-h-32 rounded-2xl border border-stone-200 bg-white px-4 py-4 text-sm text-river outline-none transition focus:border-lotus/45"
          />
        </div>
        <Button className="mt-8 h-14">
          Submit application
          <ArrowRight data-icon="inline-end" strokeWidth={1.4} />
        </Button>
      </GlassPanel>

      <div className="grid gap-4">
        {benefits.map((benefit) => {
          const Icon = benefit.icon

          return (
            <GlassPanel key={benefit.title} innerClassName="p-6">
              <Icon className="text-gold-100" strokeWidth={1.35} />
              <h3 className="mt-5 text-lg font-medium text-river">
                {benefit.title}
              </h3>
              <p className="mt-3 text-sm leading-7 text-river/58">
                {benefit.copy}
              </p>
            </GlassPanel>
          )
        })}
      </div>
    </div>
  )
}
