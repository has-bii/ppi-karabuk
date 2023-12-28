import Navigator from "@/components/Auth/Navigator"
import { Metadata } from "next"
import { ReactNode } from "react"

export const metadata: Metadata = {
  title: "Login | PPI Karabuk",
}

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <main className="min-h-screen relative">
      <Navigator />
      <section className="absolute z-0 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        {children}
      </section>
    </main>
  )
}
