import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

const excludePaths = ["/api/auth/login", "/api/auth/register", "/api/nav/fetch", "/api/nav/create"]

export function middleware(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith("/api")) {
    if (excludePaths.includes(request.nextUrl.pathname)) return NextResponse.next()

    const cookie = request.cookies.has("user_token")

    if (!cookie)
      return NextResponse.json({ message: "Unauthorized. Login first!" }, { status: 403 })
  }

  return NextResponse.next()
}
