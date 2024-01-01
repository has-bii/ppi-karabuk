import getSecretKey from "@/utils/api/getSecretKey"
import { cookies } from "next/headers"
import prisma from "@/lib/prisma"
import jwt from "jsonwebtoken"

export const getUser = async () => {
  try {
    const token = cookies().get("ppik_user")

    if (!token) throw new Error("Unauthorized. Sign in first!")

    // Verifying token
    const jwtPayload: any | null = jwt.verify(token.value, await getSecretKey(), (err, decoded) => {
      if (err) return null

      return decoded
    })

    if (!jwtPayload) throw new Error("Failed to verify Token!")

    const user = await prisma.user.findUnique({
      where: { id: jwtPayload.id },
      select: { id: true, name: true, role: true, img: true },
    })

    if (!user) throw new Error("Unauthorized. User has been removed!")

    const tokenRecord = await prisma.token.findUnique({ where: { value: token.value } })

    if (!tokenRecord) throw new Error("Token is invalid!")

    if (tokenRecord.expireDate < new Date()) throw new Error("Token is expired!")

    return user
  } catch (error) {
    console.log("Error while getting user:\n", error)

    return null
  }
}
