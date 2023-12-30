import prisma from "@/lib/prisma"
import getUser from "@/utils/api/getUser"
import { Nav } from "@prisma/client"
import { NextRequest } from "next/server"

export async function PUT(request: NextRequest) {
  try {
    const user = await getUser(request)

    if (user.role !== "ADMIN") return Response.json({ message: "Request denied!" }, { status: 403 })

    const { id, name, type, isActive, url, navlistId }: Nav = await request.json()

    if (!name || !id)
      return Response.json({ message: "ID and name are required!" }, { status: 400 })

    if (type === "ITEM" && (url === undefined || url === null))
      return Response.json({ message: "URL is required if the type is ITEM!" }, { status: 400 })

    const navlistRecord = await prisma.nav.update({
      where: { id },
      data: { name, type, isActive, url, navlistId },
    })

    return Response.json(
      { message: "Nav record has been updated.", data: navlistRecord },
      { status: 200 }
    )
  } catch (error) {
    console.error("Error while updating Nav record: ", error)

    return Response.json({ message: "Internal server error!" }, { status: 500 })
  }
}
