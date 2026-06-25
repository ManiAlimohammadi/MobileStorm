import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "mobilestorm-secret-change-in-production-2024"
);

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("ms_session")?.value;

  // Protect /admin routes — require ADMIN role
  if (pathname.startsWith("/admin")) {
    if (!token) return NextResponse.redirect(new URL("/login?next=/admin", request.url));
    try {
      const { payload } = await jwtVerify(token, SECRET);
      if (payload.role !== "ADMIN") return NextResponse.redirect(new URL("/", request.url));
    } catch {
      return NextResponse.redirect(new URL("/login?next=/admin", request.url));
    }
  }

  // Protect /account routes — require any auth
  if (pathname.startsWith("/account")) {
    if (!token) return NextResponse.redirect(new URL("/login?next=/account", request.url));
    try {
      await jwtVerify(token, SECRET);
    } catch {
      return NextResponse.redirect(new URL("/login?next=/account", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/account/:path*"],
};
