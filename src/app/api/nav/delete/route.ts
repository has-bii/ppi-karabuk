import prisma from "@/lib/prisma"
import getUser from "@/utils/api/getUser"
import { NextRequest } from "next/server"

export async function DELETE(request: NextRequest) {
  try {
    const user = await getUser(request)

    if (user.role !== "ADMIN") return Response.json({ message: "Request denied!" }, { status: 403 })

    const id = request.nextUrl.searchParams.get("id")

    if (!id) return Response.json({ message: "ID is required!" }, { status: 400 })

    await prisma.nav.deleteMany({ where: { navlistId: Number(id) } })

    await prisma.nav.delete({ where: { id: Number(id) } })

    return Response.json({ message: "Nav record has been deleted." }, { status: 200 })
  } catch (error) {
    console.error("Error while deleting Nav record: ", error)

    return Response.json({ message: "Internal server error!" }, { status: 500 })
  }
}
