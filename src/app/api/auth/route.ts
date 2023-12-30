import { UserFetchResponse } from "@/types/user"
import getUser from "@/utils/api/getUser"
import { NextRequest, NextResponse } from "next/server"

export const dynamic = "force-dynamic"

export async function GET(req: NextRequest): Promise<NextResponse<UserFetchResponse>> {
  try {
    const user = await getUser(req)

    return NextResponse.json(
      {
        message: "Fetch successful.",
        status: "ok",
        data: { id: user.id, img: user.img, name: user.name, role: user.role },
      },
      { status: 200 }
    )
  } catch (error) {
    console.error("Error while fetching user: ", error)
    return NextResponse.json(
      { message: "Internal server error", status: "error", error: {} },
      { status: 500 }
    )
  }
}
