"use server"

import prisma from "@/lib/prisma"
import { getUser } from "@/utils/auth/getUser"
import { existsSync, unlinkSync, writeFileSync } from "fs"

export type UpdateImageProfileResponse = {
  status: "success" | "error"
  message: string
}

export default async function removeProfileImage(): Promise<UpdateImageProfileResponse> {
  try {
    const user = await getUser()

    if (!user) return { status: "error", message: "User doesn't exist!" }

    if (user.img && existsSync("public" + user.img)) unlinkSync("public" + user.img)

    await prisma.user.update({ where: { id: user.id }, data: { img: null } })

    return { status: "success", message: "Profile image has been removed" }
  } catch (error) {
    console.log("Failed to remove User Profile Image: ", error)
    return { status: "error", message: "Failed to remove profile image" }
  }
}
