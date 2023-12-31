import Navbar from "@/components/app/navbar/Navbar"
import { getUser } from "@/utils/auth/getUser"
import { redirect } from "next/navigation"
import { UserProps } from "@/types/user"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "App | PPI Karabuk",
}

export const dynamic = "force-dynamic"
export const fetchCache = "default-no-store"
export const revalidate = 0

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const user: UserProps | null = await getUser()

  if (!user) {
    redirect("/error/logout")
  }

  return (
    <main className="flex flex-col min-h-screen min-w-screen overflow-x-hidden scrollbar-thin bg-gray-50">
      <Navbar user={user} />
      {children}
    </main>
  )
}
