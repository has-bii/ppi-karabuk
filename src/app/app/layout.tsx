import Navbar from "@/components/app/navbar/Navbar"
import { getUser } from "@/utils/auth/getUser"
import { redirect } from "next/navigation"
import type { Metadata } from "next"
import { UserProps } from "@/types/user"

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
    <main className="flex flex-col h-screen w-screen">
      <Navbar user={user} />
      <div className="h-full w-full bg-gray-50 flex z-0">
        <div className="container bg-white p-8 rounded-xl border my-14 drop-shadow z-0 overflow-hidden">
          {children}
        </div>
      </div>
    </main>
  )
}
