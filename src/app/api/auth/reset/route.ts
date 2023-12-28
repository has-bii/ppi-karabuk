import prisma from "@/lib/prisma"
import bcrypt from "bcrypt"
import { AuthResetErrorResponse, AuthResponse } from "@/types/auth"
import { NextResponse } from "next/server"

export async function POST(
  req: Request
): Promise<NextResponse<AuthResponse<AuthResetErrorResponse>>> {
  try {
    const { token, password }: { token: string; password: string } = await req.json()

    if (!token)
      return NextResponse.json(
        { message: "Token is required!", status: "error", error: { token: "Token is required!" } },
        { status: 400 }
      )

    if (!password)
      return NextResponse.json(
        {
          message: "Password is required!",
          status: "error",
          error: { password: "Password is required!" },
        },
        { status: 400 }
      )

    // Check Token
    const checkToken = await prisma.token.findUnique({ where: { value: token } })
    if (!checkToken)
      return NextResponse.json(
        {
          message: "Token does not exist!",
          status: "error",
          error: { token: "Token does not exist!" },
        },
        { status: 409 }
      )

    await prisma.user.update({
      where: { id: checkToken.userId },
      data: { password: bcrypt.hashSync(password, 12) },
    })

    return NextResponse.json(
      { message: "Password has been changed.", status: "ok" },
      { status: 200 }
    )
  } catch (error) {
    console.error("Error at /api/auth/reset API endpoint: ", error)
    return NextResponse.json(
      { message: "Internal server error", status: "error", error: {} },
      { status: 500 }
    )
  }
}
