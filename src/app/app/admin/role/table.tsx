"use client"

import ChangeRole from "@/components/app/RolesManagement/ChangeRole"
import UserStatus from "@/components/app/RolesManagement/UserStatus"
import UserInTable from "@/components/app/UserInTable"
import UserRole from "@/components/app/UserRole"
import TableComponent from "@/components/app/table/Table"
import SearchByName from "@/components/app/table/searchByName"
import getDate from "@/utils/getDate"
import { $Enums } from "@prisma/client"
import { useState } from "react"

type Props = {
  Data: {
    id: string
    name: string
    email: string
    role: $Enums.Role[]
    isActive: boolean
    image: string | null
    createdAt: Date
  }[]
}

export default function Table({ Data }: Props) {
  const [data, setData] = useState<Props["Data"]>(Data)

  return (
    <>
      <SearchByName dataProp={Data} setData={setData} />
      <TableComponent dataProp={data} columns={["user", "role", "status", "created at", ""]}>
        {data.map((row) => (
          <tr key={row.id}>
            <td scope="row">
              <UserInTable user={{ name: row.name, email: row.email, image: row.image }} />
            </td>
            <td>
              <UserRole role={row.role} size="md" />
            </td>
            <td>
              <UserStatus isActive={row.isActive} size="md" />
            </td>
            <td>{getDate(row.createdAt.toString())}</td>
            <td>
              <ChangeRole id={row.id} role={row.role} setData={setData} />
            </td>
          </tr>
        ))}
      </TableComponent>
    </>
  )
}
