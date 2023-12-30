import Navbar from "@/components/app/navbar/Navbar"
import type { Metadata } from "next"
import ToLogin from "@/components/app/error/ToLogin"
import { getUser } from "@/utils/auth/getUser"

export const metadata: Metadata = {
  title: "App | PPI Karabuk",
}

export const dynamic = "force-dynamic"
export const fetchCache = "default-no-store"
export const revalidate = 0

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const user = await getUser()

  if (!user) {
    return (
      <main className="relative h-screen w-screen">
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
