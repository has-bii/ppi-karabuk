import Navbar from "@/components/app/navbar/Navbar"
import { redirect } from "next/navigation"
import type { Metadata } from "next"
import { getSession } from "@/utils/auth/session"
import { UserSession } from "@/types/session"

export const metadata: Metadata = {
  title: "Dashboard | PPI Karabuk",
}

export const dynamic = "force-dynamic"
export const fetchCache = "default-no-store"
export const revalidate = 0

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const user: UserSession | null = await getSession()

  if (!user) {
    redirect("/error/logout")
  }

  return (
    <main className="min-h-dvh pt-16 md:pt-24 max-w-screen overflow-x-hidden bg-gray-50 relative">
      <Navbar user={user} />
      {children}
    </main>
  )
}
