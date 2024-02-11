import { ReactNode } from "react"
import { Metadata } from "next"
import checkRoleGetSession from "@/utils/checkRoleGetSession"

type Props = {
  children: ReactNode
}

export const metadata: Metadata = {
  title: "Student | PPI Karabuk",
}

export default async function StudentLayout({ children }: Props) {
  await checkRoleGetSession("STUDENT")

  return <>{children}</>
}
