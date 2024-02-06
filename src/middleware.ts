import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { updateSession } from "./utils/auth/session"

export async function middleware(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith("/app")) {
    if (!request.cookies.has("session")) {
      const url = new URL("/auth", request.nextUrl.origin)

      url.searchParams.set("callbackUrl", request.nextUrl.href)

      return NextResponse.redirect(url)
    }
  }

  if (request.nextUrl.pathname.startsWith("/auth")) {
    if (request.nextUrl.pathname.startsWith("/auth/verificationemail")) return NextResponse.next()

    if (request.cookies.has("session")) return NextResponse.redirect(new URL("/app", request.url))
  }

  // return NextResponse.next()
  return await updateSession(request)
}
