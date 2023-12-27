"use server"

import prisma from "@/lib/prisma"
import { AuthResponse } from "@/types/auth"

export default async function checkStudentID(studentID: string): Promise<AuthResponse> {
  try {
    const checkStudentID = await prisma.user.findUnique({ where: { studentId: studentID } })

    if (checkStudentID)
      return { status: "error", message: "Student ID is already in use.", error: {} }

    return { status: "ok", message: "Student ID is available." }
  } catch (error) {
    console.error("Failed to check Student ID!\n", error)
    return { status: "error", message: "Internal server error!", error: {} }
  }
}
