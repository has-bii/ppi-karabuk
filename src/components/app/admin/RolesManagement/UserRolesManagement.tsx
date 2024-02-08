"use client"

import getFileServiceURL from "@/utils/getFileServiceURL"
import { $Enums } from "@prisma/client"
import getDate from "@/utils/getDate"
import { useState } from "react"
import Image from "next/image"
import dummyPP from "@/images/dummy-pp.png"
import UserRole from "../../UserRole"
import UserStatus from "./UserStatus"
import { useToast } from "@/context/ToastContext"
import { Pagination } from "@/types/table"
import TablePagination from "../../TablePagination"
import ChangeRole from "./ChangeRole"

type Props = {
  DATA: {
    id: string
    name: string
    image: string | null
    role: $Enums.Role[]
    isActive: boolean
    createdAt: Date
  }[]
}

export default function UserRolesManagement({ DATA }: Props) {
  const [data, setData] = useState<Props["DATA"]>(DATA)
  const [pagination, setPagination] = useState<Pagination>({ start: 0, end: 10, row: 10 })
  const { pushToast } = useToast()

  return (
    <div className="table rounded-lg border overflow-hidden">
      <table>
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">Photo</th>
            <th scope="col">Name</th>
            <th scope="col">Role</th>
            <th scope="col">Status</th>
            <th scope="col">Created At</th>
            <th scope="col"></th>
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr className="text-center">
              <td colSpan={6}>There is no data</td>
            </tr>
          ) : (
            data.slice(pagination.start, pagination.end).map((item, index) => (
              <tr key={item.id} className="bg-white border-b">
                <td scope="row">{(pagination.start + index + 1).toString()}</td>
                <td>
                  <div className="relative h-14 aspect-square overflow-hidden">
                    <Image
                      src={item.image ? getFileServiceURL(item.image) : dummyPP}
                      alt=""
                      fill
                      quality={100}
                      sizes="33vw"
                      className="object-cover rounded-full"
                    />
                  </div>
                </td>
                <td className="whitespace-nowrap capitalize">{item.name}</td>
                <td className="whitespace-nowrap uppercase">
                  <UserRole role={item.role} size="sm" />
                </td>
                <td className="whitespace-nowrap capitalize">
                  <UserStatus isActive={item.isActive} size="sm" />
                </td>
                <td className="whitespace-nowrap capitalize">
                  {getDate(item.createdAt.toString())}
                </td>
                <td>
                  <ChangeRole id={item.id} role={item.role} setData={setData} />
                </td>
              </tr>
            ))
          )}

          <TablePagination data={data} pagination={pagination} setPagination={setPagination} />
        </tbody>
      </table>
    </div>
  )
}
