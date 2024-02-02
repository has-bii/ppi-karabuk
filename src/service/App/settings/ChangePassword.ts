"use server"

import getSecretKey from "@/utils/api/getSecretKey"
import { cookies } from "next/headers"
import prisma from "@/lib/prisma"
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"

type Response = {
  status: "success" | "error"
  message: string
}

export default async function ChangePassword(formData: FormData): Promise<Response> {
  try {
    const currentPass = formData.get("current-password") as string
    const newPass = formData.get("new-password") as string

    const token = cookies().get("ppik_user")?.value

    if (!token) throw new Error("")

    // Verifying token
    const jwtPayload: any | null = jwt.verify(token, await getSecretKey(), (err, decoded) => {
      if (err) return null

      return decoded
    })

    if (!jwtPayload) throw new Error("")

    const user = await prisma.user.findUnique({
      where: { id: jwtPayload.id },
    })

    if (!user) return { status: "error", message: "User doesn't exist!" }

    // Check password
    if (!bcrypt.compareSync(currentPass, user.password))
      return { message: "Invalid password!", status: "error" }

    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: bcrypt.hashSync(newPass, 12),
      },
    })

    return { status: "success", message: "Password has been changed" }
  } catch (error) {
    console.error("Error while changing password: ", error)

    return { status: "error", message: "Internal server error!" }
  }
}
