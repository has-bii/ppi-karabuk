import Footer from "@/components/Footer"
import Nav from "@/components/Nav"

export default function LandingPageLayout({
  children, // will be a page or nested layout
}: {
  children: React.ReactNode
}) {
  return (
    <main className="min-h-screen flex flex-col">
      <Nav />

      {children}

      <Footer />
    </main>
  )
}
