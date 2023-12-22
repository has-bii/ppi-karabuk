import { config } from "@fortawesome/fontawesome-svg-core"
import "@fortawesome/fontawesome-svg-core/styles.css"
config.autoAddCss = false
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "@/styles/globals.css"
import { ToastProvider } from "@/provider/ToastProvider"
import ReactQueryProvider from "@/provider/ReactQueryProvider"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "PPI Karabuk",
  description:
    "PPI Karabük adalah wadah berhimpunnya pelajar Indonesia di Karabük untuk membina anggota, pendalaman etika, ilmu, akselerasi potensi diri dan penyaluran aspirasi.",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ReactQueryProvider>
          <ToastProvider>{children}</ToastProvider>
        </ReactQueryProvider>
      </body>
    </html>
  )
}
