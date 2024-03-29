"use client"

import UserStatus from "@/components/app/RolesManagement/UserStatus"
import UserInTable from "@/components/app/UserInTable"
import UserRole from "@/components/app/UserRole"
import TableComponent from "@/components/app/table/Table"
import SearchByName from "@/components/app/table/searchByName"
import { useToast } from "@/context/ToastContext"
import getDate from "@/utils/getDate"
import getFileServiceURL from "@/utils/getFileServiceURL"
import { $Enums } from "@prisma/client"
import Link from "next/link"
import React, { useCallback, useEffect, useState } from "react"

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
  const [data, setData] = useState<Props["dataProp"]>(dataProp)
  const { pushToast } = useToast()

  useEffect(() => {
    if (!dataProp) pushToast("Failed to fetch Data!", "error")
  }, [dataProp, pushToast])

  const filterByName = useCallback(
    (name: string) => {
      setData(dataProp.filter((item) => item.user.name.includes(name)))
    },
    [dataProp]
  )

  return (
    <>
      <SearchByName dataProp={dataProp} setData={setData} func={filterByName} />
      <TableComponent
        columns={[
          "student",
          "status",
          "role",
          "tempat tanggal lahir",
          "asal",
          "wa",
          "mobile",
          "gender",
          "tempat tinggal",
          "jurusan",
          "strata",
          "kedatangan",
          "student ID",
          "TC Kimlik",
          "Passport ID",
          "Files",
        ]}
        dataProp={data}
      >
        {data.length === 0 ? (
          <tr className="text-center">
            <td colSpan={6}>There is no data</td>
          </tr>
        ) : (
          data.map((item) => (
            <tr key={item.id}>
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
        )}
      </TableComponent>
    </>
  )
}
