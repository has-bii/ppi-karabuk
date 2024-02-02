"use server"

import prisma from "@/lib/prisma"
import { getUser } from "@/utils/auth/getUser"
import { existsSync, unlinkSync } from "fs"

type Response = {
  status: "success" | "error"
  message: string
}

export default async function deleteRequest(id: bigint): Promise<Response> {
  try {
    const user = await getUser()

    if (!user) return { status: "error", message: "User doesn't exist!" }

    const data = await prisma.activationRequest.findUnique({ where: { id: id, userId: user.id } })

    if (!data) return { status: "error", message: "Data doesn't exist!" }

    if (existsSync("public" + data.img)) unlinkSync("public" + data.img)

    await prisma.activationRequest.delete({ where: { id: id } })

    return { message: "Data has been deleted", status: "success" }
  } catch (error) {
    console.error("Error while handling delete activation request record: ", error)
    return { message: "Internal server error!", status: "error" }
  }
}
