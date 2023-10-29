import prisma from "@/lib/prisma"
import getUser from "@/utils/getUser"
import { NextRequest } from "next/server"

export async function POST(req: NextRequest) {
  try {
    const user = await getUser(req)

    await prisma.token.delete({ where: { value: req.cookies.get("user_token")?.value } })

    return Response.json({ message: "Logout success." }, { status: 200 })
  } catch (error) {
    console.error("Error while logging out route: ", error)
    return Response.json({ message: "Internal server error" }, { status: 500 })
  }
}
