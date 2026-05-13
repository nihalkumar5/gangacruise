import { NextResponse } from "next/server"
import { z } from "zod"

const releaseSchema = z.object({
  holdId: z.string().min(1),
})

export async function POST(request: Request) {
  const payload = releaseSchema.safeParse(await request.json())

  if (!payload.success) {
    return NextResponse.json({ error: "Invalid release request" }, { status: 400 })
  }

  return NextResponse.json({
    holdId: payload.data.holdId,
    status: "released",
  })
}
