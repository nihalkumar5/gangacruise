import { LuxuryNav } from "@/components/layout/luxury-nav"
import { PageHero } from "@/components/shared/page-hero"
import { SiteFooter } from "@/components/shared/site-footer"
import { TicketClient } from "@/features/booking/components/ticket-client"

type TicketPageProps = {
  params: Promise<{ token: string }>
}

export default async function TicketPage({ params }: TicketPageProps) {
  const { token } = await params

  return (
    <>
      <LuxuryNav />
      <main>
        <PageHero
          eyebrow="Ticket issued"
          title="Your river pass is ready."
          copy="A premium QR-ready confirmation view. The production email uses the same ticket payload through Resend."
        />
        <section className="pb-28">
          <TicketClient token={token} />
        </section>
      </main>
      <SiteFooter />
    </>
  )
}
