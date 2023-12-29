import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

const excludePaths = ["/api/auth", "/api/nav/fetch", "/api/instagram"]

export function middleware(request: NextRequest) {
  // Check Token in every API Endpoint
  if (request.nextUrl.pathname.startsWith("/api")) {
    if (excludePaths.some((path) => request.nextUrl.pathname.startsWith(path)))
      return NextResponse.next()

    const cookie = request.cookies.has("ppik_user_token")

    if (!cookie)
      return NextResponse.json({ message: "Unauthorized. Login first!" }, { status: 403 })
  }

  // Check isLogged in Auth Pages
  if (request.nextUrl.pathname.startsWith("/auth")) {
    const cookie = request.cookies.has("ppik_user_token")

    if (cookie) return NextResponse.redirect(new URL("/app", request.url))
  }

  if (request.nextUrl.pathname.startsWith("/app")) {
    const cookie = request.cookies.has("ppik_user_token")

    if (!cookie) return NextResponse.redirect(new URL("/auth", request.url))
  }

  return NextResponse.next()
}
