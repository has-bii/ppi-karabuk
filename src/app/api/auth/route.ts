import getUser from "@/utils/getUser"
import { NextRequest } from "next/server"

export async function GET(req: NextRequest) {
  try {
    const user = await getUser(req)

    return Response.json(
      { message: "Fetch successful.", data: { id: user.id, name: user.name } },
      { status: 200 }
    )
  } catch (error) {
    console.error("Error while fetching user: ", error)
    return Response.json({ message: "Internal server error" }, { status: 500 })
  }
}
