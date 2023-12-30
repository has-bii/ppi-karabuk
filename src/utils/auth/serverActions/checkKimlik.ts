"use server"

import prisma from "@/lib/prisma"
import { AuthResponse } from "@/types/auth"

export default async function checkKimlik(kimlikID: string): Promise<AuthResponse> {
  try {
    const checkKimlikID = await prisma.user.findUnique({ where: { kimlikId: kimlikID } })

    if (checkKimlikID) return { status: "error", message: "Kimlik is already in use.", error: {} }

    return { status: "ok", message: "Kimlik is available." }
  } catch (error) {
    console.error("Failed to check TC Kimlik!\n", error)
    return { status: "error", message: "Internal server error!", error: {} }
  }
}
