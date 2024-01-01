import Navbar from "@/components/app/navbar/Navbar"
import { getUser } from "@/utils/auth/getUser"
import { redirect } from "next/navigation"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "App | PPI Karabuk",
}

export const dynamic = "force-dynamic"
export const fetchCache = "default-no-store"
export const revalidate = 0

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const user = await getUser()

  if (!user) {
    redirect("/auth")
  }

  return (
    <main className="min-h-screen w-screen overflow-hidden p-4 lg:p-8">
      <Navbar user={user} />
      {children}
    </main>
  )
}
