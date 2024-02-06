"use server"

import prisma from "@/lib/prisma"
import { changeSession, getSession } from "@/utils/auth/session"
import { Prisma } from "@prisma/client"

type Args = {
  id: string
  name: string
  email: string
  studentID: string
  kimlikID: string
}

type Response = { status: "success" | "error"; message: string }

export default async function updateUserData({
  id,
  email,
  kimlikID,
  name,
  studentID,
}: Args): Promise<Response> {
  try {
    const session = await getSession()

    if (!session) return { status: "error", message: "User doesn't exist!" }

    const user = await prisma.user.findUnique({ where: { id: session.id } })

    if (!user) return { status: "error", message: "User doesn't exist!" }

    const updated = await prisma.user.update({
      where: { id: session.id },
      data: {
        email: email.toLowerCase(),
        name: name.toLowerCase(),
        kimlikId: kimlikID,
        studentId: studentID,
        emailVerified: email.toLowerCase() === session.email ? user.emailVerified : null,
      },
    })

    if (session.name !== name) await changeSession(session, "name", name)

    return { status: "success", message: "User data has been updated" }
  } catch (e) {
    console.log("Failed to update user data: ", e)

    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      if (e.code === "P2002")
        if (typeof e.meta?.target === "object")
          return {
            status: "error",
            message:
              (e.meta.target as string[]).join(", ").toUpperCase().replace("ID", " ID") +
              " already in use!",
          }
    }

    return { status: "error", message: "Internal server error!" }
  }
}
