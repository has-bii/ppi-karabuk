import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

const excludePaths = ["/api/auth", "/api/nav/fetch", "/api/instagram"]

export function middleware(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith("/api")) {
    if (excludePaths.some((path) => request.nextUrl.pathname.startsWith(path)))
      return NextResponse.next()

    const cookie = request.cookies.has("user_token")

    if (!cookie)
      return NextResponse.json({ message: "Unauthorized. Login first!" }, { status: 403 })
  }

  if (request.nextUrl.pathname.startsWith("/auth")) {
    const cookie = request.cookies.has("user_token")

    if (cookie) return NextResponse.redirect(new URL("/app", request.url))
  }

  return NextResponse.next()
}
