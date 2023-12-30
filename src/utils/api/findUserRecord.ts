import prisma from "../../lib/prisma"

export default async function findUserRecord(
  email: string | undefined,
  studentId: string | undefined,
  kimlikId: string | undefined
) {
  if (email) {
    const checkEmail = await prisma.user.findUnique({ where: { email: email } })

    if (checkEmail) return checkEmail
  }

  if (studentId) {
    const checkStudentId = await prisma.user.findUnique({ where: { studentId: studentId } })

    if (checkStudentId) return checkStudentId
  }

  if (kimlikId) {
    const checkKimlikId = await prisma.user.findUnique({ where: { kimlikId: kimlikId } })

    if (checkKimlikId) return checkKimlikId
  }

  return null
}
