import prisma from "@/lib/prisma"

export const dynamic = "force-dynamic"

export default async function VerifyEmail({
  searchParams,
}: {
  searchParams?: { [key: string]: string | string[] | undefined }
}) {
  const response = await checkToken(searchParams?.t)

  if (!response)
    return (
      <h1 className="text-3xl md:text-6xl font-extrabold text-black text-center">Invalid Token!</h1>
    )

  return (
    <h1 className="text-3xl md:text-4xl font-extrabold text-black text-center">
      Congratulations! Your email address has been successfully verified!
    </h1>
  )
}

async function checkToken(t: string | string[] | undefined): Promise<boolean> {
  if (typeof t === "string") {
    const token = await prisma.token.findUnique({
      where: { value: t, expireDate: { gte: new Date() } },
    })

    if (token) {
      await prisma.user.update({ where: { id: token.userId }, data: { emailVerified: new Date() } })
      await prisma.token.delete({ where: { id: token.id } })
      return true
    }
  }

  return false
}
