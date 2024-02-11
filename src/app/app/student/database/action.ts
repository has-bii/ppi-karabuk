"use server"

import prisma from "@/lib/prisma"
import { UserSession } from "@/types/session"
import { getSession } from "@/utils/auth/session"
import saveFile from "@/utils/saveFile"
import { z } from "zod"

const validateString = (field: string) =>
  z.string({
    invalid_type_error: field + " must be a string",
    required_error: field + " is required!",
  })

const FormDataScheme = z.object({
  birthPlace: validateString("Place birth"),
  birthDate: validateString("Date birth")
    .refine(
      (val) => {
        return !isNaN(new Date(val).getDate())
      },
      { message: "Invalid date type" }
    )
    .transform((val) => new Date(val)),
  wa: validateString("Whatsapp number").transform((val) => val.replace(/\s/g, "")),
  telp: validateString("Mobile").transform((val) => val.replace(/\s/g, "")),
  domisili: validateString("Domisili"),
  gender: z.enum(["MALE", "FEMALE"]),
  tempatTinggal: z.enum(["APPARTEMENT", "DORMITORY"], {
    required_error: "Tempat tinggal is required!",
    invalid_type_error: "Tempat tinggal must be either Appartement or Asrama",
  }),
  university: z.string({
    invalid_type_error: "University must be a string",
    required_error: "University is required!",
  }),
  department: validateString("Departement"),
  strata: z.enum(["TOMER", "S1", "S2", "S3"]),
  tahunKedatangan: z.string().refine((val) => new Date().getFullYear() >= parseInt(val), {
    message: `Tahun kedatangan mustn't be higher than ${new Date().getFullYear()}`,
  }),
  studentId: validateString("Student Number").length(10, {
    message: "Student ID must contain 10 digits!",
  }),
  passportId: validateString("Passport number").refine((val) => val.length >= 8, {
    message: "Passport number min characters is 8",
  }),
  ikametId: validateString("TC Kimlik").refine((val) => val.length === 11, {
    message: "TC Kimlik must contain 11 characters",
  }),
})

type Response<T> = {
  message: string
} & ({ status: "success" | "danger" } | { status: "error"; error: T })

export async function onAction(prevState: any, formData: FormData): Promise<Response<string[]>> {
  "use server"
  try {
    const session = (await getSession()) as UserSession

    const record = await prisma.databaseMahasiswa.findUnique({ where: { userId: session.id } })

    const res = FormDataScheme.safeParse(Object.fromEntries(formData.entries()))

    if (!res.success) {
      return {
        status: "error",
        message: "Invalid form!",
        error: res.error.errors.map(({ message }) => message),
      }
    }

    const fileOgrenci = await prisma.activationRequest.findFirst({
      where: { userId: session.id, status: "APPROVED" },
      orderBy: { createdAt: "desc" },
    })

    if (!fileOgrenci)
      return {
        status: "error",
        message: "Internal server error!",
        error: ["Please send an activation request"],
      }

    const data = { ...res.data, fileOgrenci: fileOgrenci.file }

    const filePassport = formData.get("filePassport") as File
    const fileIkamet = formData.get("fileIkamet") as File

    if (!record) {
      if (filePassport.size === 0)
        return { status: "error", message: "", error: ["Passport File is required!"] }
      if (fileIkamet.size === 0)
        return { status: "error", message: "", error: ["Ikamet File is required!"] }

      await prisma.databaseMahasiswa.create({
        data: {
          userId: session.id,
          birthDate: data.birthDate,
          birthPlace: data.birthPlace,
          wa: data.wa,
          telp: data.telp,
          domisili: data.domisili,
          gender: data.gender,
          tempatTinggal: data.tempatTinggal,
          university: data.university,
          department: data.department,
          strata: data.strata,
          tahunKedatangan: data.tahunKedatangan,
          studentId: data.studentId,
          fileOgrenci: fileOgrenci.file,
          passportId: data.passportId,
          filePassport: await saveFile("/files", filePassport),
          ikametId: data.ikametId,
          fileIkamet: await saveFile("/files", fileIkamet),
        },
      })
    } else
      await prisma.databaseMahasiswa.update({
        where: { userId: session.id },
        data: {
          birthDate: data.birthDate,
          birthPlace: data.birthPlace,
          wa: data.wa,
          telp: data.telp,
          domisili: data.domisili,
          gender: data.gender,
          tempatTinggal: data.tempatTinggal,
          university: data.university,
          department: data.department,
          strata: data.strata,
          tahunKedatangan: data.tahunKedatangan,
          studentId: data.studentId,
          fileOgrenci: fileOgrenci.file,
          passportId: data.passportId,
          filePassport:
            filePassport.size === 0
              ? record.filePassport
              : await saveFile("/files", filePassport, record.filePassport),
          ikametId: data.ikametId,
          fileIkamet:
            fileIkamet.size === 0
              ? record.fileIkamet
              : await saveFile("/files", fileIkamet, record.fileIkamet),
        },
      })

    return { status: "success", message: "Mahasiswa Database has been submitted" }
  } catch (error) {
    console.error("Failed to save Mahasiswa Database: ", error)
    return { status: "error", message: "Internal server error!", error: [] }
  }
}
