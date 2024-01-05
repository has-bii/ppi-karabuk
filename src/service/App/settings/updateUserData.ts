"use server"

import prisma from "@/lib/prisma"
import { Prisma } from "@prisma/client"

type Args = {
  id: string
  name: string
  email: string
  studentID: string
  kimlikID: string
}

export default async function updateUserData({
  id,
  email,
  kimlikID,
  name,
  studentID,
}: Args): Promise<{ status: "success" | "error"; message: string }> {
  try {
    const user = await prisma.user.findUnique({ where: { id: id } })

    if (!user) return { status: "error", message: "User doesn't exist!" }

    await prisma.user.update({
      where: { id: user.id },
      data: {
        email: email.toLowerCase(),
        name: name.toLowerCase(),
        kimlikId: kimlikID,
        studentId: studentID,
        emailVerified: email.toLowerCase() === user.email ? user.emailVerified : null,
      },
    })

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
