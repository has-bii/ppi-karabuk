import prisma from "@/lib/prisma"

export async function GET() {
  try {
    const data = await prisma.nav.findMany({
      where: { isActive: true, navlistId: { equals: null } },
      include: { navitems: { where: { isActive: true } } },
    })

    return Response.json({ message: "Fetch successful.", data }, { status: 200 })
  } catch (error) {
    console.error("Error while fetching Nav data: ", error)

    return Response.json({ message: "Internal server error!" }, { status: 500 })
  }
}
