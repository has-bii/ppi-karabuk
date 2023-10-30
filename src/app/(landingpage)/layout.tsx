import Nav from "@/components/Nav"

export default function LandingPageLayout({
  children, // will be a page or nested layout
}: {
  children: React.ReactNode
}) {
  return (
    <main>
      <Nav />

      {children}
    </main>
  )
}
