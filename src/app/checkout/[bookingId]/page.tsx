import { LuxuryNav } from "@/components/layout/luxury-nav"
import { PageHero } from "@/components/shared/page-hero"
import { SiteFooter } from "@/components/shared/site-footer"
import { CheckoutClient } from "@/features/booking/components/checkout-client"
import { createRazorpayOrderMock } from "@/lib/providers/payment"

type CheckoutPageProps = {
  params: Promise<{ bookingId: string }>
  searchParams: Promise<{ seats?: string }>
}

export default async function CheckoutPage({ params, searchParams }: CheckoutPageProps) {
  const { bookingId } = await params
  const { seats = "S01,S02" } = await searchParams
  const seatCount = seats.split(",").filter(Boolean).length
  const order = await createRazorpayOrderMock(seatCount * 4200 * 100, bookingId)

  return (
    <>
      <LuxuryNav />
      <main>
        <PageHero
          eyebrow="Checkout"
          title="Confirm securely."
          copy="Production architecture creates Razorpay orders server-side and confirms bookings only after webhook verification."
        />
        <section className="pb-28">
          <CheckoutClient
            bookingId={bookingId}
            defaultSeatCount={seatCount}
            orderId={order.id}
          />
        </section>
      </main>
      <SiteFooter />
    </>
  )
}
