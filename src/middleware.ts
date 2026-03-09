import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  if (path.startsWith("/admin") && !path.startsWith("/admin/login")) {
    let token = null;
    try {
      token = await getToken({
        req: request,
        secret: process.env.NEXTAUTH_SECRET,
      });
    } catch {
      // JWT decryption failed → treat as no session, redirect to login
      token = null;
    }
    if (!token) {
      const url = new URL("/admin/login", request.url);
      url.searchParams.set("callbackUrl", path);
      return NextResponse.redirect(url);
    }
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
