import ResetPassword from "@/components/Auth/ResetPassword"
import prisma from "@/lib/prisma"

async function checkToken(t: string | string[] | undefined): Promise<string | false> {
  if (typeof t === "string") {
    const token = await prisma.token.findUnique({ where: { value: t } })

    if (token) return t
  }

  return false
}

export default async function Reset({
  searchParams,
}: {
  searchParams?: { [key: string]: string | string[] | undefined }
}) {
  const token = await checkToken(searchParams?.t)

  if (!token)
    return (
      <h1 className="text-3xl md:text-6xl font-extrabold text-black text-center">Invalid Token!</h1>
    )

  return <ResetPassword token={token} />
}
