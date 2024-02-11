"use client"

import departments from "@/json/departements.json"
import FormFile from "@/components/app/student/database/FormFile"
import SubmitButton from "./SubmitButton"
import { onAction } from "./action"
import { useFormState } from "react-dom"
import { useEffect } from "react"
import { useToast } from "@/context/ToastContext"
import { useRouter } from "next/navigation"
import { $Enums } from "@prisma/client"
import getBirthDate from "@/utils/getBirthDate"
import getFileServiceURL from "@/utils/getFileServiceURL"

type Props = {
  data: {
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
  } | null
}

export default function Form({ data }: Props) {
  const [formState, formAction] = useFormState(onAction, null)
  const { pushToast } = useToast()
  const router = useRouter()

  useEffect(() => {
    if (formState) {
      if (formState.status === "success") {
        pushToast(formState.message, formState.status)
        router.push("/app/student/details")
      }

      if (formState.status === "error")
        formState.error.forEach((error) => {
          pushToast(error, "error")
        })
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formState])

  return (
    <form action={formAction}>
      {/* Biodata Details */}
      <div className="flex flex-col w-full gap-4 border rounded-lg p-4 lg:p-8 mb-4">
        <p className="text-xl text-black font-bold text-left">Biodata Details</p>
        <div className="flex flex-col lg:flex-row gap-2 lg:gap-4 w-full">
          <label className="w-1/3 whitespace-nowrap inline-flex items-center">
            Tempat Tanggal Lahir
          </label>
          <div className="inline-flex gap-2 w-full">
            <input
              type="text"
              name="birthPlace"
              className="px-3 py-1.5 border rounded-lg w-full bg-gray-50"
              placeholder="Bekasi"
              defaultValue={data?.birthPlace}
              required
            />
            <input
              type="date"
              name="birthDate"
              className="px-3 py-1.5 border rounded-lg w-full bg-gray-50"
              defaultValue={
                data?.birthDate !== undefined ? getBirthDate(data.birthDate) : undefined
              }
              required
            />
          </div>
        </div>
        <div className="flex flex-col lg:flex-row gap-2 lg:gap-4 w-full">
          <label className="w-1/3 whitespace-nowrap inline-flex items-center">
            Whatsapp / Mobile
          </label>
          <div className="inline-flex gap-2 w-full">
            <input
              type="text"
              name="wa"
              className="px-3 py-1.5 border rounded-lg w-full bg-gray-50"
              placeholder="+62 813 1302 2870"
              defaultValue={data?.wa}
              required
            />
            <input
              type="text"
              name="telp"
              className="px-3 py-1.5 border rounded-lg w-full bg-gray-50"
              placeholder="+90 552 558 75 01"
              defaultValue={data?.telp}
              required
            />
          </div>
        </div>
        <div className="flex flex-col lg:flex-row gap-2 lg:gap-4 w-full">
          <label htmlFor="ikametId" className="w-1/3 whitespace-nowrap inline-flex items-center">
            TC Kimlik
          </label>
          <input
            type="text"
            name="ikametId"
            id="ikametId"
            className="px-3 py-1.5 border rounded-lg w-full bg-gray-50"
            placeholder="99504420070"
            defaultValue={data?.ikametId}
            required
          />
        </div>
        <div className="flex flex-col lg:flex-row gap-2 lg:gap-4 w-full">
          <label htmlFor="passportId" className="w-1/3 whitespace-nowrap inline-flex items-center">
            Nomor Paspor
          </label>
          <input
            type="text"
            name="passportId"
            id="passportId"
            className="px-3 py-1.5 border rounded-lg w-full bg-gray-50"
            placeholder="C4123822"
            defaultValue={data?.passportId}
            required
          />
        </div>
        <div className="flex flex-col lg:flex-row gap-2 lg:gap-4 w-full">
          <label htmlFor="domisili" className="w-1/3 whitespace-nowrap inline-flex items-center">
            Domisili Indonesia
          </label>
          <input
            type="text"
            name="domisili"
            id="domisili"
            className="px-3 py-1.5 border rounded-lg w-full bg-gray-50"
            placeholder="Jakarta"
            defaultValue={data?.domisili}
            required
          />
        </div>
        <div className="flex flex-col lg:flex-row gap-2 lg:gap-4 w-full">
          <label className="w-1/3 whitespace-nowrap inline-flex items-center h-fit">
            Jenis Kelamin
          </label>
          <div className="w-full block gap-4">
            <label className="block">
              <input
                type="radio"
                name="gender"
                className="mr-4 mb-2"
                value="MALE"
                required
                defaultChecked={data?.gender === "MALE"}
              />
              Laki-laki
            </label>
            <label className="block">
              <input
                type="radio"
                name="gender"
                className="mr-4 mb-2"
                value="FEMALE"
                required
                defaultChecked={data?.gender === "FEMALE"}
              />
              Perempuan
            </label>
          </div>
        </div>
        <div className="flex flex-col lg:flex-row gap-2 lg:gap-4 w-full">
          <label className="w-1/3 whitespace-nowrap inline-flex items-center h-fit">
            Tempat Tinggal
          </label>
          <div className="w-full block gap-4">
            <label className="block">
              <input
                type="radio"
                name="tempatTinggal"
                className="mr-4 mb-2"
                value="APPARTEMENT"
                required
                defaultChecked={data?.tempatTinggal === "APPARTEMENT"}
              />
              Appartement
            </label>
            <label className="block">
              <input
                type="radio"
                name="tempatTinggal"
                className="mr-4 mb-2"
                value="DORMITORY"
                required
                defaultChecked={data?.tempatTinggal === "DORMITORY"}
              />
              Asrama
            </label>
          </div>
        </div>
      </div>

      {/* Education Details */}
      <div className="flex flex-col w-full gap-4 border rounded-lg p-4 lg:p-8 mb-4">
        <p className="text-xl text-black font-bold text-left">Education Details</p>
        <div className="flex flex-col lg:flex-row gap-2 lg:gap-4 w-full">
          <label htmlFor="studentId" className="w-1/3 whitespace-nowrap inline-flex items-center">
            Student ID
          </label>
          <input
            type="text"
            id="studentId"
            name="studentId"
            className="px-3 py-1.5 border rounded-lg w-full bg-gray-50"
            placeholder="2010213592"
            required
            defaultValue={data?.studentId}
          />
        </div>
        <div className="flex flex-col lg:flex-row gap-2 lg:gap-4 w-full">
          <label htmlFor="university" className="w-1/3 whitespace-nowrap inline-flex items-center">
            Universitas
          </label>
          <input
            type="text"
            id="university"
            name="university"
            className="px-3 py-1.5 border rounded-lg w-full bg-gray-50 hover:cursor-not-allowed"
            placeholder="Karabuk University"
            value="Karabuk University"
            readOnly
            required
          />
        </div>
        <div className="flex flex-col lg:flex-row gap-2 lg:gap-4 w-full">
          <label htmlFor="department" className="w-1/3 whitespace-nowrap inline-flex items-center">
            Jurusan
          </label>
          <select
            name="department"
            id="department"
            className="px-3 py-1.5 border rounded-lg w-full bg-gray-50"
            defaultValue={data?.department}
          >
            {departments.map((department, index) => (
              <option key={index} value={department.name}>
                {department.name}
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-col lg:flex-row gap-2 lg:gap-4 w-full">
          <label htmlFor="strata" className="w-1/3 whitespace-nowrap inline-flex items-center">
            Strata
          </label>
          <select
            name="strata"
            id="strata"
            className="px-3 py-1.5 border rounded-lg w-full bg-gray-50"
            defaultValue={data?.strata}
          >
            <option value="TOMER">TOMER</option>
            <option value="S1">S1</option>
            <option value="S2">S2</option>
            <option value="S3">S3</option>
          </select>
        </div>
        <div className="flex flex-col lg:flex-row gap-2 lg:gap-4 w-full">
          <label
            htmlFor="tahunKedatangan"
            className="w-1/3 whitespace-nowrap inline-flex items-center"
          >
            Tahun Kedatangan
          </label>
          <input
            type="number"
            id="tahunKedatangan"
            name="tahunKedatangan"
            className="px-3 py-1.5 border rounded-lg w-full bg-gray-50 inline-flex"
            placeholder="2019"
            required
            defaultValue={data?.tahunKedatangan}
          />
        </div>
      </div>

      {/* Files Section */}
      <div className="flex flex-col w-full gap-4 border rounded-lg p-4 lg:p-8 mb-4">
        <p className="text-xl text-black font-bold text-left">Files Section</p>
        <FormFile
          file={data?.filePassport ? getFileServiceURL(data.filePassport) : null}
          id="filePassport"
          label="Passport File"
        />
        <FormFile
          file={data?.fileIkamet ? getFileServiceURL(data.fileIkamet) : null}
          id="fileIkamet"
          label="Ikamet File"
        />
      </div>

      <SubmitButton />
    </form>
  )
}
