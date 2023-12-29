import Navbar from "@/components/app/navbar/Navbar"
import prisma from "@/lib/prisma"
import type { Metadata } from "next"
import jwt from "jsonwebtoken"
import getSecretKey from "@/utils/getSecretKey"
import { cookies } from "next/headers"
import ToLogin from "@/components/app/error/ToLogin"

export const metadata: Metadata = {
  title: "App | PPI Karabuk",
}

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  async function getUser() {
    try {
      const token = cookies().get("ppik_user_token")

      if (!token) throw new Error("Unauthorized. Sign in first!")

      // Verifying token
      const jwtPayload: any | null = jwt.verify(
        token.value,
        await getSecretKey(),
        (err, decoded) => {
          if (err) return null

          return decoded
        }
      )

      if (!jwtPayload) throw new Error("Failed to verify Token!")

      const user = await prisma.user.findUnique({
        where: { id: jwtPayload.id },
        select: { id: true, name: true, role: true, img: true },
      })

      if (!user) throw new Error("Unauthorized. User has been removed!")

      const tokenRecord = await prisma.token.findUnique({ where: { value: token.value } })

      if (!tokenRecord) throw new Error("Token is invalid!")

      if (tokenRecord.expireDate < new Date()) throw new Error("Token is expired!")

      return user
    } catch (error) {
      console.log("Error while getting user:\n", error)

      return null
    }
  }

  const user = await getUser()

  // if (!user) {
  //   return <ToLogin />
  // }
  if (!user) {
    return (
      <main className="relative h-screen w-screen">
        {/* <Navbar user={user} /> */}
        <ToLogin />
        {children}
      </main>
    )
  }

  return (
    <main className="min-h-screen w-screen overflow-hidden p-4 lg:p-8">
      <Navbar user={user} />
      {children}
    </main>
  )
}
