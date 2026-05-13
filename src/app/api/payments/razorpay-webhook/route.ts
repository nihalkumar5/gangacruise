import { NextResponse } from "next/server"

import { verifyPaymentSignatureMock } from "@/lib/providers/payment"

export async function POST(request: Request) {
  const signature = request.headers.get("x-razorpay-signature")
  const body = await request.text()
  const verified = verifyPaymentSignatureMock()

  if (!verified || !body) {
    return NextResponse.json({ error: "Webhook verification failed" }, { status: 401 })
  }

  return NextResponse.json({
    received: true,
    signaturePresent: Boolean(signature),
    nextAction: "confirm_booking_idempotently",
  })
}
