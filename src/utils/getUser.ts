import jwt from "jsonwebtoken"
import { NextRequest } from "next/server"
import getSecretKey from "./getSecretKey"
import prisma from "@/lib/prisma"

export default async function getUser(req: NextRequest) {
  try {
    const token = req.cookies.get("user_token")?.value

    if (!token) throw new Error("Unauthorized. Sign in first!")

    // Verifying token
    const jwtPayload: any = jwt.verify(token, await getSecretKey())

    const user = await prisma.user.findUnique({
      where: { id: jwtPayload.id },
    })

    if (!user) throw new Error("Unauthorized. User has been removed!")

    const tokenRecord = await prisma.token.findUnique({ where: { value: token } })

    if (!tokenRecord) throw new Error("Token is invalid!")

    if (tokenRecord.expireDate < new Date()) throw new Error("Token is expired!")

    return user
  } catch (error) {
    console.log("Error while getting user: ")

    throw error
  }
}
