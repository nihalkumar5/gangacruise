import { NextResponse } from "next/server"
import { z } from "zod"

const holdSchema = z.object({
  sailingId: z.string().min(1),
  seats: z.array(z.string().min(1)).min(1).max(12),
  guestEmail: z.string().email(),
})

export async function POST(request: Request) {
  const payload = holdSchema.safeParse(await request.json())

  if (!payload.success) {
    return NextResponse.json(
      { error: "Invalid hold request", issues: payload.error.flatten() },
      { status: 400 },
    )
  }

  return NextResponse.json({
    holdId: `hold_${payload.data.sailingId}_${payload.data.seats.join("_")}`,
    expiresInSeconds: 600,
    status: "held",
  })
}
