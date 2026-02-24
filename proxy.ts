import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "medcore-hospital-pms-secret-2026-secure"
);

const PUBLIC = ["/auth/login", "/api/auth/login", "/api/auth/logout"];

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (
    PUBLIC.some((p) => pathname.startsWith(p)) ||
    pathname.startsWith("/_next")
  )
    return NextResponse.next();

  const token = req.cookies.get("auth-token")?.value;

  if (!token)
    return NextResponse.redirect(new URL("/auth/login", req.url));

  try {
    await jwtVerify(token, SECRET);
    return NextResponse.next();
  } catch {
    const r = NextResponse.redirect(new URL("/auth/login", req.url));
    r.cookies.delete("auth-token");
    return r;
  }
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};