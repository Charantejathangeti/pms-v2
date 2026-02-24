import { NextRequest, NextResponse } from "next/server";
import { searchPatients } from "@/lib/actions";
export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get("q") || "";
  return NextResponse.json(await searchPatients(q));
}
