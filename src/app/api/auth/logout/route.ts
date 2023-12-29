import prisma from "@/lib/prisma"
import { AuthResponse } from "@/types/auth"
import getUser from "@/utils/getUser"
import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest): Promise<NextResponse<AuthResponse>> {
  try {
    const user = await getUser(req)

    await prisma.token.delete({ where: { value: req.cookies.get("ppik_user_token")?.value } })

    const response: AuthResponse<{}> = {
      message: "Logout successful",
      status: "ok",
    }

    const jsonResponse = NextResponse.json(response, {
      status: 200,
    })

    jsonResponse.cookies.delete("ppik_user_token")

    return jsonResponse
  } catch (error) {
    console.error("Error while logging out route: ", error)
    return NextResponse.json(
      { message: "Internal server error", status: "error", error: {} },
      { status: 500 }
    )
  }
}
