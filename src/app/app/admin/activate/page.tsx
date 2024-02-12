import PageWrapper from "@/components/app/PageWrapper"
import navSideAdmin from "../navSideAdmin"
import prisma from "@/lib/prisma"
import { Response } from "@/types/response"
import { VerifyParams } from "@/types/activationrequest"
import Table from "./table"

// Fetch Data
async function fetchData() {
  try {
    return prisma.activationRequest.findMany({
      include: { user: { select: { name: true } } },
      orderBy: { createdAt: "desc" },
    })
  } catch (error) {
    console.error("Cannot fetch Activation Request by admin: ", error)
    return []
  }
}

// Server Actions
async function updateStatus({ requestId, userId, status }: VerifyParams): Promise<Response> {
  "use server"
  try {
    if (status === "APPROVED") {
      const user = await prisma.user.findUnique({ where: { id: userId } })

      if (!user) return { status: "error", message: "User doesn't exist!" }

      if (!user.role.includes("STUDENT")) user.role.push("STUDENT")

      if (user.role.includes("USER")) user.role.splice(user.role.indexOf("USER"), 1)

      await prisma.user.update({ where: { id: userId }, data: { isActive: true, role: user.role } })

      await prisma.activationRequest.update({
        where: { id: requestId },
        data: { status: "APPROVED" },
      })

      return { status: "success", message: "Verified request successfully" }
    }

    await prisma.activationRequest.update({
      where: { id: requestId },
      data: { status: "REJECTED" },
    })

    await prisma.user.update({ where: { id: userId }, data: { isActive: false } })

    return { status: "success", message: "Rejected request successfully" }
  } catch (error) {
    console.error("Failed to verify user: ", error)

    return { status: "error", message: "Internal server error!" }
  }
}

// Main function
export default async function Page() {
  const data = await fetchData()

  return (
    <PageWrapper url="/admin" navSideItems={navSideAdmin}>
      <p className="text-2xl text-black font-bold text-left mb-6">Activation Requests</p>
      <Table DATA={data} updateStatus={updateStatus} />
    </PageWrapper>
  )
}
