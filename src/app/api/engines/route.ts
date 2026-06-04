import { NextResponse } from "next/server";
import { listEngines } from "@/lib/ai/engines";

export const runtime = "nodejs";

export async function GET() {
  return NextResponse.json({ engines: listEngines() });
}
