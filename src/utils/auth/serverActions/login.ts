"use server"

import { AuthLoginErrorResponse, AuthResponse } from "@/types/auth"
import findUserRecord from "@/utils/auth/findUserRecord"
import getSecretKey from "@/utils/api/getSecretKey"
import { cookies } from "next/headers"
import prisma from "@/lib/prisma"
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"

export default async function login({
  email,
  password,
}: {
  email: string
  password: string
}): Promise<AuthResponse<AuthLoginErrorResponse>> {
  try {
    // Find User Record
    const user = await findUserRecord(email.toLowerCase())

    if (!user)
      return {
        message: "Email is not registered!",
        status: "error",
        error: { email: "Email is not registered!" },
      }

    // Check Password
    const checkPW = bcrypt.compareSync(password, user.password)

    if (!checkPW)
      return {
        message: "Invalid password!",
        status: "error",
        error: { password: "Invalid password!" },
      }

    const token = jwt.sign({ id: user.id, name: user.name }, await getSecretKey(), {
      algorithm: "HS256",
    })

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

    return { status: "success", message: "Logged successfully" }
  } catch (error) {
    console.log("Internal server error. Failed to Login: ", error)
    return { message: "Internal server error", status: "error", error: {} }
  }
}
