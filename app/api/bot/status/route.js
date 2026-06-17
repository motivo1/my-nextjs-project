import { NextResponse } from "next/server";
import { getBotStatus } from "../../../../lib/discuss-bot";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json(getBotStatus());
}
