import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Auth | PPI Karabuk",
}

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <main>
      <section className="w-screen h-screen flex items-center justify-center">{children}</section>
    </main>
  )
}
