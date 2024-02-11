import prisma from "@/lib/prisma"
import { getSession } from "@/utils/auth/session"

async function fetchData() {
  try {
    const session = await getSession()

    if (!session) return null

    if (!session.role.includes("ADMIN")) return null

    const data = await prisma.databaseMahasiswa.findMany({
      include: {
        user: {
          select: {
            name: true,
            email: true,
            role: true,
            image: true,
            isActive: true,
          },
        },
      },
    })

    return data
  } catch (error) {
    console.error("Failed to fetch Mahasiswa Database: ", error)
    return null
  }
}

export { fetchData }
