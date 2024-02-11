import PageWrapper from "@/components/app/PageWrapper"
import prisma from "@/lib/prisma"
import navSideAdmin from "../navSideAdmin"
import UserRolesManagement from "@/components/app/RolesManagement/UserRolesManagement"

async function fetchData() {
  try {
    const data = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        role: true,
        image: true,
        isActive: true,
        createdAt: true,
      },
    })

    return data
  } catch (error) {
    console.error("Failed to fetch data in User Roles Management: ", error)
    return []
  }
}

export default async function Page() {
  const data = await fetchData()

  return (
    <PageWrapper url="/admin" navSideItems={navSideAdmin}>
      <p className="text-2xl text-black font-bold text-left mb-4">User Roles Management</p>
      <UserRolesManagement DATA={data} />
    </PageWrapper>
  )
}
