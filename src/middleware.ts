import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith("/app")) {
    if (!request.cookies.has("ppik_user")) {
      const url = new URL("/auth", request.nextUrl.origin)

      url.searchParams.set("callbackUrl", request.nextUrl.href)

      return NextResponse.redirect(url)
    }
  }

  if (request.nextUrl.pathname.startsWith("/auth")) {
    if (request.cookies.has("ppik_user")) return NextResponse.redirect(new URL("/app", request.url))
  }

  return NextResponse.next()
}
