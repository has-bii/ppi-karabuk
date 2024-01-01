import prisma from "../../lib/prisma"

export default async function findUserRecord(email: string) {
  try {
    const checkEmail = await prisma.user.findUnique({ where: { email: email } })

    if (checkEmail) return checkEmail

    const checkStudentId = await prisma.user.findUnique({ where: { studentId: email } })

    if (checkStudentId) return checkStudentId

    const checkKimlikId = await prisma.user.findUnique({ where: { kimlikId: email } })

    if (checkKimlikId) return checkKimlikId

    return null
  } catch (error) {
    console.log("Failed to find User: ", error)
    return null
  }
}
