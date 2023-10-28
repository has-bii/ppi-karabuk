import getUser from "@/utils/getUser"
import { NextRequest } from "next/server"

export async function GET(req: NextRequest) {
  try {
    if (req.method !== "GET") return Response.json({ message: "Invalid method!" }, { status: 400 })

    const user = await getUser(req)

    return Response.json({ message: "Login successful.", data: { user } }, { status: 200 })
  } catch (error) {
    console.error("Error while fetching user: ", error)
    return Response.json({ message: "Internal server error" }, { status: 500 })
  }
}
