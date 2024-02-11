import PageWrapper from "@/components/app/PageWrapper"
import { getSession } from "@/utils/auth/session"
import navSideStudent from "../navSideStudent"
import { UserSession } from "@/types/session"
import prisma from "@/lib/prisma"
import Form from "./form"

// Fetch Data
async function getData() {
  try {
    const session = (await getSession()) as UserSession

    return await prisma.databaseMahasiswa.findUnique({ where: { userId: session.id } })
  } catch (error) {
    console.error("Failed to fetch Database Mahasiswa: ", error)

    return null
  }
}

export default async function Page() {
  const data = await getData()

  return (
    <PageWrapper url="/student" navSideItems={navSideStudent}>
      <p className="text-2xl text-black font-bold text-left mb-6">Database Mahasiswa</p>
      <Form data={data} />
    </PageWrapper>
  )
}
