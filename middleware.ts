import { NextRequest, NextResponse } from "next/server";
import { verifyJWT } from "@/lib/auth";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow access to /admin/login and /api/admin/login without authentication
  if (pathname === "/admin/login" || pathname === "/api/admin/login") {
    return NextResponse.next();
  }

  // Protect /api/admin routes
  if (pathname.startsWith("/api/admin")) {
    const authHeader = request.headers.get("authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return handleUnauthorized(request, pathname);
    }

    const token = authHeader.substring(7); // Remove "Bearer "
    const payload = verifyJWT(token);

    if (!payload) {
      return handleUnauthorized(request, pathname);
    }

    // Valid token, allow request
    return NextResponse.next();
  }

  // Allow other routes
  return NextResponse.next();
}

function handleUnauthorized(request: NextRequest, pathname: string) {
  if (pathname.startsWith("/api/admin")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  } else {
    const loginUrl = new URL("/admin/login", request.url);
    return NextResponse.redirect(loginUrl);
  }
}
