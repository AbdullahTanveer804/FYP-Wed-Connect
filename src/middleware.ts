import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request });
  console.log('token', token)
  const url = request.nextUrl;

  // If trying to access admin pages without being an admin
  if (url.pathname.startsWith("/admin")) {
    if (!token || token.role !== "ADMIN") {
      // Redirect non-admin users to home page
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  // If NOT logged in and trying to access protected routes
  if (!token && url.pathname.startsWith("/dashboard")) {
    return NextResponse.redirect(new URL("/login", request.url));
  }
  // If logged in and trying to access auth routes or public routes
  if (token) {
    // Check if trying to access auth routes or public paths
    if (
      url.pathname.startsWith("/login") ||
      url.pathname.startsWith("/signup") ||
      url.pathname.startsWith("/verify")
    ) {
      return NextResponse.redirect(new URL("/", request.url));
    }

  }

  // Otherwise allow
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",
    "/login",
    "/signup/:path*",
    "/dashboard/:path*",
    "/verify/:path*",
    "/admin/:path*", // Add admin routes to the matcher
  ],
};
