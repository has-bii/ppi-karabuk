import PageWrapper from "@/components/app/PageWrapper"
import React from "react"
import navSideAdmin from "../navSideAdmin"
import { fetchData } from "./mahasiswaDatabase"
import TableMahasiswaDatabase from "./tableMahasiswaDatabase"

export default async function Page() {
  const data = await fetchData()

  return (
    <PageWrapper url="/admin" navSideItems={navSideAdmin}>
      <p className="text-2xl text-black font-bold text-left mb-6">Mahasiswa Database</p>
      {data !== null ? <TableMahasiswaDatabase dataProp={data} /> : ""}
    </PageWrapper>
  )
}
