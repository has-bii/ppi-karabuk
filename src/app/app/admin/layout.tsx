import { ReactNode } from "react"
import { Metadata } from "next"
import checkRoleGetSession from "@/utils/checkRoleGetSession"

type Props = {
  children: ReactNode
}

export const metadata: Metadata = {
  title: "Admin | PPI Karabuk",
}

export default async function AdminLayout({ children }: Props) {
  await checkRoleGetSession("ADMIN")

  return <>{children}</>
}
