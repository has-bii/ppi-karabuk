import prisma from "@/lib/prisma"
import findUserRecord from "@/utils/api/findUserRecord"
import getSecretKey from "@/utils/api/getSecretKey"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import { NextResponse } from "next/server"
import { AuthBody, AuthLoginErrorResponse, AuthResponse } from "@/types/auth"

export async function POST(
  req: Request
): Promise<NextResponse<AuthResponse<AuthLoginErrorResponse>>> {
  try {
    const { email, studentId, kimlikId, password }: AuthBody = await req.json()

    if (!email && !studentId && !kimlikId)
      return NextResponse.json(
        {
          message: "Either an email, student ID, or a kimlik ID is required!",
          status: "error",
          error: {},
        },
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

    // Find User Record
    const user = await findUserRecord(email?.toLowerCase(), studentId, kimlikId)

    if (!user)
      return NextResponse.json(
        {
          message: "Email is not registered!",
          status: "error",
          error: { email: "Email is not registered!" },
        },
        { status: 404 }
      )

    // Check Password
    const checkPW = bcrypt.compareSync(password, user.password)

    if (!checkPW)
      return NextResponse.json(
        { message: "Invalid password!", status: "error", error: { password: "Invalid password!" } },
        { status: 401 }
      )

    const token = jwt.sign({ id: user.id, name: user.name }, await getSecretKey(), {
      algorithm: "HS256",
    })

    // Create Token
    await prisma.token.create({
      data: {
        userId: user.id,
        type: "AUTH",
        value: token,
        expireDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    })

    const response: AuthResponse<{}> = {
      message: "Login successful",
      status: "ok",
    }

    const jsonResponse = NextResponse.json(response, {
      status: 200,
    })

    jsonResponse.cookies.set("ppik_user_token", token, {
      sameSite: "strict",
      expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      secure: true,
      httpOnly: true,
    })

    return jsonResponse
  } catch (error) {
    console.error("Error at /api/auth/login route: ", error)
    return NextResponse.json(
      { message: "Internal server error", status: "error", error: {} },
      { status: 500 }
    )
  }
}
