"use client"

import UserStatus from "@/components/app/RolesManagement/UserStatus"
import TablePagination from "@/components/app/TablePagination"
import TablePaginationOutside from "@/components/app/TablePaginationOutside"
import UserInTable from "@/components/app/UserInTable"
import UserRole from "@/components/app/UserRole"
import { useToast } from "@/context/ToastContext"
import { Pagination } from "@/types/table"
import getDate from "@/utils/getDate"
import getFileServiceURL from "@/utils/getFileServiceURL"
import { $Enums } from "@prisma/client"
import Link from "next/link"
import React, { useEffect, useState } from "react"

type Props = {
  dataProp:
    | ({
        user: {
          name: string
          email: string
          role: $Enums.Role[]
          isActive: boolean
          image: string | null
        }
      } & {
        id: string
        userId: string
        birthPlace: string
        birthDate: Date
        wa: string
        telp: string
        domisili: string
        gender: $Enums.Gender
        tempatTinggal: $Enums.TempatTinggal
        university: string
        department: string
        strata: $Enums.Pendidikan
        tahunKedatangan: string
        studentId: string
        fileOgrenci: string
        passportId: string
        filePassport: string
        ikametId: string
        fileIkamet: string
        createdAt: Date
        updatedAt: Date
      })[]
}

export default function TableMahasiswaDatabase({ dataProp }: Props) {
  const [data, SetData] = useState<Props["dataProp"]>(dataProp)
  const [pagination, setPagination] = useState<Pagination>({ start: 0, end: 10, row: 10 })
  const { pushToast } = useToast()

  useEffect(() => {
    if (!dataProp) pushToast("Failed to fetch Data!", "error")
  }, [dataProp, pushToast])
  return (
    <>
      <div className="max-w-full overflow-x-auto md:scrollbar-none md:hover:scrollbar-thin rounded-lg border">
        <div className="table overflow-hidden">
          <table>
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">Student</th>
                <th scope="col">Status</th>
                <th scope="col">Role</th>
                <th scope="col">Tempat Tanggal Lahir</th>
                <th scope="col">Asal</th>
                <th scope="col">WA</th>
                <th scope="col">Mobile</th>
                <th scope="col">Gender</th>
                <th scope="col">Tempat Tinggal</th>
                <th scope="col">Jurusan</th>
                <th scope="col">Strata</th>
                <th scope="col">Kedatangan</th>
                <th scope="col">Student ID</th>
                <th scope="col">TC Kimlik</th>
                <th scope="col">Passport ID</th>
                <th scope="col">Files</th>
              </tr>
            </thead>
            <tbody>
              {data.length > 0 ? (
                data.slice(pagination.start, pagination.end).map((item, index) => (
                  <tr key={item.id} className="bg-white border-b">
                    <td scope="row">{(pagination.start + index + 1).toString()}</td>
                    <td className="w-fit">
                      <UserInTable user={item.user} />
                    </td>
                    <td>
                      <UserStatus isActive={item.user.isActive} size="md" />
                    </td>
                    <td>
                      <UserRole role={item.user.role} size="md" />
                    </td>
                    <td className="capitalize">{`${item.birthPlace}, ${getDate(
                      item.birthDate.toString()
                    )}`}</td>
                    <td className="capitalize">{item.domisili}</td>
                    <td>{item.wa}</td>
                    <td>{item.telp}</td>
                    <td className="capitalize">{item.gender.toLocaleLowerCase()}</td>
                    <td className="capitalize">{item.tempatTinggal.toLocaleLowerCase()}</td>
                    <td className="capitalize">{item.department}</td>
                    <td>{item.strata}</td>
                    <td>{item.tahunKedatangan}</td>
                    <td>{item.studentId}</td>
                    <td>{item.ikametId}</td>
                    <td>{item.passportId}</td>
                    <td>
                      <div className="inline-flex gap-1">
                        <Link
                          href={getFileServiceURL(item.fileIkamet)}
                          target="_blank"
                          className="px-3 py-1.5 bg-black text-white rounded-md"
                        >
                          Ikamet
                        </Link>
                        <Link
                          href={getFileServiceURL(item.fileOgrenci)}
                          target="_blank"
                          className="px-3 py-1.5 bg-black text-white rounded-md"
                        >
                          Student
                        </Link>
                        <Link
                          href={getFileServiceURL(item.filePassport)}
                          target="_blank"
                          className="px-3 py-1.5 bg-black text-white rounded-md"
                        >
                          Passport
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr className="text-center">
                  <td colSpan={6}>There is no data</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      <TablePaginationOutside data={data} pagination={pagination} setPagination={setPagination} />
    </>
  )
}
