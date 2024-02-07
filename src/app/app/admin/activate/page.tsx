import PageWrapper from "@/components/app/PageWrapper"
import { navSide } from "../navSide"
import prisma from "@/lib/prisma"
import TableActivationRequest from "@/components/app/ActivationRequest/TableActivationRequest"
import { getSession } from "@/utils/auth/session"
import { redirect } from "next/navigation"
import { Response } from "@/types/response"
import { VerifyParams } from "@/types/activationrequest"

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
    await checkRoleAndSession()

    if (status === "APPROVED") {
      await prisma.user.update({ where: { id: userId }, data: { isVerified: new Date() } })

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

    await prisma.user.update({ where: { id: userId }, data: { isVerified: null } })

    return { status: "success", message: "Rejected request successfully" }
  } catch (error) {
    console.error("Failed to verify user: ", error)

    return { status: "error", message: "Internal server error!" }
  }
}

async function checkRoleAndSession() {
  const session = await getSession()

  if (!session) redirect("/auth")

  if (!session.role.includes("ADMIN")) redirect("/app")
}

// Main function
export default async function Page() {
  const data = await fetchData()

  return (
    <PageWrapper url="/admin" navSideItems={navSide}>
      <TableActivationRequest DATA={data} updateStatus={updateStatus} />
    </PageWrapper>
  )
}
