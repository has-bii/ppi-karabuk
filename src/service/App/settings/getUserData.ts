"use server"

import prisma from "@/lib/prisma"
import { Role } from "@prisma/client"
import { getSession } from "@/utils/auth/session"

export type UserData = {
  id: string
  name: string
  email: string
  studentId: string
  kimlikId: string
  role: Role[]
  isVerified: Date | null
  emailVerified: Date | null
  image: string | null
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
    const session = await getSession()

    if (!session) return { status: "error" }

    const user = await prisma.user.findUnique({
      where: { id: session.id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        studentId: true,
        kimlikId: true,
        isVerified: true,
        emailVerified: true,
        image: true,
      },
    })

    if (user) return { status: "ok", data: user }

    return { status: "error" }
  } catch (error) {
    console.log("Failed to fetch User Data: ", error)
    return { status: "error" }
  }
}
