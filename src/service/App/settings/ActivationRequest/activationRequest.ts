"use server"

import prisma from "@/lib/prisma"
import generateFileName from "@/utils/generateFileName"
import { getSession } from "@/utils/auth/session"
import { existsSync, mkdirSync, writeFileSync } from "fs"

type Response = {
  status: "success" | "error"
  message: string
}

export default async function activationRequest(formData: FormData): Promise<Response> {
  try {
    const user = await getSession()

    if (!user) return { status: "error", message: "User doesn't exist!" }

    const file = formData.get("file-input") as File

    if (!["image/jpeg", "image/png", "image/jpg", "application/pdf"].includes(file.type))
      return { message: "Invalid file type!", status: "error" }

    if (file.size > 2 * 1024 * 1024) return { message: "Max file size is 2MB!", status: "error" }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    if (!existsSync("public/activation-request")) mkdirSync("public/activation-request")

    const path = "/activation-request/" + generateFileName(file.name)

    writeFileSync("public" + path, buffer)

    await prisma.activationRequest.create({ data: { userId: user.id, file: path } })

    return { message: "Activation request has been sent", status: "success" }
  } catch (error) {
    console.error("Error while handling activation request: ", error)
    return { message: "Internal server error!", status: "error" }
  }
}
