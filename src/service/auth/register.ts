"use server"

import { AuthRegisterErrorResponse, AuthResponse } from "@/types/auth"
import { cookies } from "next/headers"
import { randomUUID } from "crypto"
import prisma from "@/lib/prisma"
import bcrypt from "bcrypt"
import sendEmail from "@/lib/sendEmail"
import verificationEmailTemplate from "@/template/verificationEmailTemplate"
import { encrypt } from "./auth"

type RegisterPayload = {
  name: string
  email: string
  studentID: string
  kimlikID: string
  password: string
}

type Response = AuthResponse<AuthRegisterErrorResponse>

export default async function register({
  name,
  email,
  kimlikID,
  password,
  studentID,
}: RegisterPayload): Promise<Response> {
  try {
    const user = await prisma.user.create({
      data: {
        name: name.toLowerCase(),
        email: email.toLowerCase(),
        studentId: studentID,
        kimlikId: kimlikID,
        password: bcrypt.hashSync(password, 12),
      },
    })

    const token = await encrypt({ id: user.id, name: user.name })

    // Create Token
    await prisma.token.create({
      data: {
        userId: user.id,
        type: "AUTH",
        value: token,
        expireDate: new Date(Date.now() + 24 * 60 * 60 * 1000),
      },
    })

    cookies().set("ppik_user", token, {
      sameSite: "strict",
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
      secure: true,
      httpOnly: true,
    })

    const code = randomUUID()

    const tokenEmailVerification = await prisma.token.create({
      data: {
        type: "EMAIL",
        value: code,
        expireDate: new Date(Date.now() + 5 * 60 * 60 * 1000),
        userId: user.id,
      },
    })

    sendEmail(
      email,
      "Verification Email",
      verificationEmailTemplate(tokenEmailVerification.value),
      "EMAIL"
    )

    return { status: "success", message: "User has been registered successfully" }
  } catch (error) {
    console.log("Internal server error. Failed to Register User: ", error)
    return { message: "Internal server error", status: "error", error: {} }
  }
}