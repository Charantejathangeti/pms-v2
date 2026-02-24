import { NextRequest, NextResponse } from "next/server";
import { login } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();
  const result = await login(email, password);
  if (!result.success) return NextResponse.json({ error: result.error }, { status: 401 });
  const res = NextResponse.json({ success: true, user: result.user });
  res.cookies.set("auth-token", result.token!, {
    httpOnly: true, secure: false, sameSite: "lax", maxAge: 86400, path: "/",
  });
  return res;
}
