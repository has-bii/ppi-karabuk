import prisma from "@/lib/prisma"
import { AuthBody, AuthResponse } from "@/types/auth"
import bcrypt from "bcrypt"
import { NextResponse } from "next/server"

export async function POST(req: Request): Promise<NextResponse<AuthResponse>> {
  try {
    const { name, email, studentId, kimlikId, password }: AuthBody = await req.json()

    if (!name || !email || !studentId || !kimlikId || !password)
      return NextResponse.json(
        { message: "Name, email, student id, kimlik id and password are required!", status: "ok" },
        { status: 400 }
      )

    // Check Exists record
    const checkEmail = await prisma.user.findUnique({ where: { email: email.toLowerCase() } })

    if (checkEmail)
      return NextResponse.json(
        {
          message: "Email is already registered!",
          status: "error",
        },
        { status: 409 }
      )

    const checkStudentId = await prisma.user.findUnique({ where: { studentId: studentId } })

    if (checkStudentId)
      return NextResponse.json(
        {
          message: "Student ID is already registered!",
          status: "error",
        },
        { status: 409 }
      )

    const checkKimlikId = await prisma.user.findUnique({ where: { kimlikId: kimlikId } })

    if (checkKimlikId)
      return NextResponse.json(
        {
          message: "Kimlik ID is already registered!",
          status: "error",
        },
        { status: 409 }
      )
    // End

    await prisma.user.create({
      data: {
        name: name.toLowerCase(),
        email: email.toLowerCase(),
        studentId: studentId,
        kimlikId: kimlikId,
        password: bcrypt.hashSync(password, 12),
      },
    })

    return NextResponse.json(
      { message: "User has been registered successfully.", status: "ok" },
      { status: 200 }
    )
  } catch (error) {
    console.error("Error at /api/auth/register route: ", error)
    return NextResponse.json({ message: "Internal server error", status: "error" }, { status: 500 })
  }
}
