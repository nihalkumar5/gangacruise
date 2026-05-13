import { NextResponse } from "next/server"
import { z } from "zod"

import { createRazorpayOrderMock } from "@/lib/providers/payment"

const orderSchema = z.object({
  amount: z.number().int().positive(),
  bookingId: z.string().min(1),
})

export async function POST(request: Request) {
  const payload = orderSchema.safeParse(await request.json())

  if (!payload.success) {
    return NextResponse.json(
      { error: "Invalid payment order", issues: payload.error.flatten() },
      { status: 400 },
    )
  }

  const order = await createRazorpayOrderMock(
    payload.data.amount,
    payload.data.bookingId,
  )

  return NextResponse.json(order)
}
