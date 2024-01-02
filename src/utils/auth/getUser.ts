import getSecretKey from "@/utils/api/getSecretKey"
import { cookies } from "next/headers"
import prisma from "@/lib/prisma"
import jwt from "jsonwebtoken"

export const getUser = async () => {
  try {
    const token = cookies().get("ppik_user")?.value

    if (!token) return null

    // Verifying token
    const jwtPayload: any | null = jwt.verify(token, await getSecretKey(), (err, decoded) => {
      if (err) return null

      return decoded
    })

    if (!jwtPayload) throw new Error("Failed to verify Token!")

    const user = await prisma.user.findUnique({
      where: { id: jwtPayload.id },
      select: { id: true, name: true, role: true, img: true },
    })

    if (!user) return null

    const tokenRecord = await prisma.token.findUnique({ where: { value: token } })

    if (!tokenRecord) return null

    if (tokenRecord.expireDate < new Date()) return null

    return user
  } catch (error) {
    console.log("Error while getting user:\n", error)

    return null
  }
}
