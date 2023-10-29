import { AuthBody } from "@/app/types/global"
import prisma from "@/lib/prisma"
import findUserRecord from "@/utils/findUserRecord"
import getSecretKey from "@/utils/getSecretKey"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    const { email, studentId, kimlikId, password }: AuthBody = await req.json()

    if (!email && !studentId && !kimlikId)
      return Response.json(
        { message: "Either an email, student ID, or a kimlik ID is required!" },
        { status: 400 }
      )

    if (!password) return Response.json({ message: "Password is required!" }, { status: 400 })

    // Find User Record
    const user = await findUserRecord(email?.toLowerCase(), studentId, kimlikId)

    if (!user) return Response.json({ message: "User does not exist!" }, { status: 404 })

    // Check Password
    const checkPW = bcrypt.compareSync(password, user.password)

    if (!checkPW) return Response.json({ message: "Invalid password!" }, { status: 401 })

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

    const response = NextResponse.json({ message: "Login successful" }, { status: 200 })

    response.cookies.set("user_token", token, {
      sameSite: "strict",
      expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      secure: true,
      httpOnly: true,
    })

    return response
  } catch (error) {
    console.error("Error at /api/auth/login route: ", error)
    return Response.json({ message: "Internal server error" }, { status: 500 })
  }
}
