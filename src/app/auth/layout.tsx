import { Metadata } from "next"
import { ReactNode } from "react"

export const metadata: Metadata = {
  title: "Login | PPI Karabuk",
}

export default function AuthLayout({ children }: { children: ReactNode }) {
  return <main className="min-h-screen flex flex-col justify-center items-center">{children}</main>
}
