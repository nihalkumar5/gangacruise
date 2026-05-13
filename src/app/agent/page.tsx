import { LuxuryNav } from "@/components/layout/luxury-nav"
import { PageHero } from "@/components/shared/page-hero"
import { SiteFooter } from "@/components/shared/site-footer"
import { AgentRegistration } from "@/features/agent/components/agent-registration"

export default function AgentPage() {
  return (
    <>
      <LuxuryNav />
      <main>
        <PageHero
          eyebrow="Agents"
          title="A refined partner channel."
          copy="Registration, attribution, commissions, and private-event handoff are planned as a role-scoped business surface."
        />
        <section className="pb-28">
          <AgentRegistration />
        </section>
      </main>
      <SiteFooter />
    </>
  )
}
