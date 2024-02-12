import PageWrapper from "@/components/app/PageWrapper"
import React from "react"
import navSideAdmin from "../navSideAdmin"
import TableMahasiswaDatabase from "./tableMahasiswaDatabase"
import { getSession } from "@/utils/auth/session"
import prisma from "@/lib/prisma"

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

export default async function Page() {
  const data = await fetchData()

  return (
    <PageWrapper url="/admin" navSideItems={navSideAdmin}>
      <p className="text-2xl text-black font-bold text-left mb-6">Mahasiswa Database</p>
      {data !== null ? <TableMahasiswaDatabase dataProp={data} /> : ""}
    </PageWrapper>
  )
}
