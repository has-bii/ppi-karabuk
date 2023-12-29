import prisma from "@/lib/prisma"
import { AuthBody, AuthRegisterErrorResponse, AuthResponse } from "@/types/auth"
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"
import { NextResponse } from "next/server"
import getSecretKey from "@/utils/getSecretKey"

export async function POST(
  req: Request
): Promise<NextResponse<AuthResponse<AuthRegisterErrorResponse>>> {
  try {
    const { name, email, studentId, kimlikId, password }: AuthBody = await req.json()

    if (!name || !email || !studentId || !kimlikId || !password)
      return NextResponse.json(
        {
          message: "Name, email, student id, kimlik id and password are required!",
          status: "error",
          error: {},
        },
        { status: 400 }
      )

    // Check Exists record
    const checkEmail = await prisma.user.findUnique({ where: { email: email.toLowerCase() } })

    if (checkEmail)
      return NextResponse.json(
        {
          message: "Email is already registered!",
          status: "error",
          error: {},
        },
        { status: 409 }
      )

    const checkStudentId = await prisma.user.findUnique({ where: { studentId: studentId } })

    if (checkStudentId)
      return NextResponse.json(
        {
          message: "Student ID is already registered!",
          status: "error",
          error: { studentID: "Student ID is already registered!" },
        },
        { status: 409 }
      )

    const checkKimlikId = await prisma.user.findUnique({ where: { kimlikId: kimlikId } })

    if (checkKimlikId)
      return NextResponse.json(
        {
          message: "Kimlik ID is already registered!",
          status: "error",
          error: { kimlikID: "Kimlik ID is already registered!" },
        },
        { status: 409 }
      )
    // End

    const user = await prisma.user.create({
      data: {
        name: name.toLowerCase(),
        email: email.toLowerCase(),
        studentId: studentId,
        kimlikId: kimlikId,
        password: bcrypt.hashSync(password, 12),
      },
    })

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
      message: "User has been registered successfully.",
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
    console.error("Error at /api/auth/register route: ", error)
    return NextResponse.json(
      { message: "Internal server error", status: "error", error: {} },
      { status: 500 }
    )
  }
}
