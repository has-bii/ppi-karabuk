import PageWrapper from "@/components/app/PageWrapper"
import { navSide } from "../navSide"
import { ActivationRequest } from "@prisma/client"
import prisma from "@/lib/prisma"

async function fetchData(): Promise<ActivationRequest[]> {
  try {
    return prisma.activationRequest.findMany()
  } catch (error) {
    console.error("Cannot fetch Activation Request by admin: ", error)
    return []
  }
}

export default async function Page() {
  const data = await fetchData()

  return (
    <PageWrapper url="/admin" navSideItems={navSide}>
      <div className="h-[50rem] scrollbar-thin scrollbar-track-black/20 scrollbar-thumb-black/70 active:scrollbar-thumb-black">
        Hello
      </div>
    </PageWrapper>
  )
}
