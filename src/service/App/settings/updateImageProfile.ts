"use server"

import prisma from "@/lib/prisma"
import generateFileName from "@/utils/api/generateFileName"
import { getUser } from "@/utils/auth/getUser"
import { existsSync, unlinkSync, writeFileSync } from "fs"

export type UpdateImageProfileResponse = {
  status: "success" | "error"
  message: string
}

export default async function updateImageProfile(
  formData: FormData
): Promise<UpdateImageProfileResponse> {
  try {
    const user = await getUser()

    if (!user) return { status: "error", message: "User doesn't exist!" }

    const file = formData.get("image") as File

    if (!file.type.startsWith("image")) return { status: "error", message: "Invalid image type!" }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    const path = "/images/profiles/" + generateFileName(file.name)

    writeFileSync("public" + path, buffer)

    if (user.img && existsSync("public" + user.img)) unlinkSync("public" + user.img)

    await prisma.user.update({ where: { id: user.id }, data: { img: path } })

    return { status: "success", message: "Profile image has been updated" }
  } catch (error) {
    console.log("Failed to update User Profile Image: ", error)
    return { status: "error", message: "Failed to update profile image" }
  }
}
