import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith("/api")) {
    if (
      request.nextUrl.pathname === "/api/auth/login" ||
      request.nextUrl.pathname === "/api/auth/register"
    )
      return NextResponse.next()

    const cookie = request.cookies.has("user_token")

    if (!cookie)
      return NextResponse.json({ message: "Unauthorized. Login first!" }, { status: 403 })
  }

  return NextResponse.next()
}
