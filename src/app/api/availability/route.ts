import { NextResponse } from "next/server"

import { cruises, sailings } from "@/lib/data/cruises"

export async function GET() {
  return NextResponse.json({
    generatedAt: new Date().toISOString(),
    cruises,
    sailings,
  })
}
