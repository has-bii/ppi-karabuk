"use server"

import getSecretKey from "@/utils/api/getSecretKey"
import { cookies } from "next/headers"
import prisma from "@/lib/prisma"
import jwt from "jsonwebtoken"
import { Role } from "@prisma/client"

export type UserData = {
  name: string
  id: string
  email: string
  studentId: string
  kimlikId: string
  role: Role[]
  isVerified: Date | null
  emailVerified: Date | null
  img: string | null
}

type Response =
  | {
      status: "ok"
      data: UserData
    }
  | {
      status: "error"
    }

export default async function getUserData(): Promise<Response> {
  try {
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
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        studentId: true,
        kimlikId: true,
        isVerified: true,
        emailVerified: true,
        img: true,
      },
    })

    if (user) return { status: "ok", data: user }

    throw new Error("")
  } catch (error) {
    console.log("Failed to fetch User Data: ", error)
    return { status: "error" }
  }
}
