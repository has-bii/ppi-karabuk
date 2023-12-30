import getUser from "@/utils/api/getUser"
import { NextRequest } from "next/server"
import bcrypt from "bcrypt"
import prisma from "@/lib/prisma"

export async function DELETE(req: NextRequest) {
  try {
    const { password }: { password: string | undefined } = await req.json()

    const user = await getUser(req)

    if (!password) return Response.json({ message: "Password is required!" }, { status: 400 })

    if (!bcrypt.compareSync(password, user.password))
      return Response.json({ message: "Invalid password!" }, { status: 401 })

    await prisma.verifyRequest.deleteMany({ where: { userId: user.id } })
    await prisma.token.deleteMany({ where: { userId: user.id } })

    await prisma.user.delete({
      where: { id: user.id },
    })

    return Response.json({ message: "User has been deleted successfully." }, { status: 200 })
  } catch (error) {
    console.error("Error while deleting user: ", error)
    return Response.json({ message: "Internal server error" }, { status: 500 })
  }
}
