import { NextResponse } from "next/server";
import { computeMetrics } from "@/lib/metrics";

export async function GET() {
  return NextResponse.json(computeMetrics());
}
