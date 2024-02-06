import { getSession } from "@/utils/auth/session"
import { redirect } from "next/navigation"
import { ReactNode } from "react"
import { Metadata } from "next"

type Props = {
  children: ReactNode
}

export const metadata: Metadata = {
  title: "Admin | PPI Karabuk",
}

export default async function Layout({ children }: Props) {
  const session = await getSession()

  if (!session) redirect("/error/logout")

  if (!session.role.includes("ADMIN")) redirect("/app")

  return <>{children}</>
}
