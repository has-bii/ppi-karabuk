"use server"

import prisma from "@/lib/prisma"
import { getUser } from "@/utils/auth/getUser"

export default async function getData() {
  try {
    const user = await getUser()

    if (!user) return []

    const data = await prisma.activationRequest.findMany({
      where: { userId: user.id },
      select: { id: true, img: true, status: true, createdAt: true },
    })

    return data
  } catch (error) {
    console.error("Error while fetching Activation Requests: ", error)
    return []
  }
}
