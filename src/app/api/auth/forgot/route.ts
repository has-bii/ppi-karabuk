import prisma from "@/lib/prisma"
import sendEmail from "@/lib/sendEmail"
import { AuthForgotErrorResponse, AuthResponse } from "@/types/auth"
import { NextResponse } from "next/server"
import jwt from "jsonwebtoken"
import getSecretKey from "@/utils/api/getSecretKey"
import resetPasswordTemplate from "@/template/resetPasswordTemplate"

export async function POST(
  req: Request
): Promise<NextResponse<AuthResponse<AuthForgotErrorResponse>>> {
  try {
    const { email }: { email: string } = await req.json()

    if (!email)
      return NextResponse.json(
        { message: "Email is required!", status: "error", error: { email: "Email is required!" } },
        { status: 400 }
      )

    // Check Exists record
    const checkEmail = await prisma.user.findUnique({ where: { email: email.toLowerCase() } })

    if (!checkEmail)
      return NextResponse.json(
        {
          message: "Email does not exist!",
          status: "error",
          error: { email: "Email does not exist!" },
        },
        { status: 409 }
      )

    // Check available Token
    const checkToken = await prisma.token.findFirst({
      where: {
        type: "FORGOT",
        userId: checkEmail.id,
        createdAt: { gte: new Date(Date.now() - 5 * 60 * 1000) },
      },
    })

    if (checkToken !== null)
      return NextResponse.json(
        {
          message: "Reset code has been already sent. Please try after 5 minutes.",
          status: "error",
          error: {},
        },
        { status: 409 }
      )

    // Generate Token
    const token = jwt.sign({ id: checkEmail.id, name: checkEmail.name }, await getSecretKey(), {
      algorithm: "HS256",
    })

    // Create Token to DB
    await prisma.token.create({
      data: {
        userId: checkEmail.id,
        type: "FORGOT",
        value: token,
        expireDate: new Date(Date.now() + 5 * 60 * 1000),
      },
    })

    if (sendEmail(email, "Recover Account", resetPasswordTemplate(token), "RECOVERY"))
      throw new Error("Failed to send email!")

    return NextResponse.json(
      { message: "Reset code has been sent to your email.", status: "ok" },
      { status: 200 }
    )
  } catch (error) {
    console.error("Error at /api/auth/forgot API endpoint: ", error)
    return NextResponse.json(
      { message: "Internal server error", status: "error", error: {} },
      { status: 500 }
    )
  }
}
