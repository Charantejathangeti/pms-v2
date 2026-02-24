import { NextResponse } from "next/server";
import { generateMRN } from "@/lib/actions";
export async function GET() {
  return NextResponse.json({ mrn: await generateMRN() });
}
