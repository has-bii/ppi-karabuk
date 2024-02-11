import { Metadata } from "next"
import React from "react"

type Props = {
  children: React.ReactNode
}

export const metadata: Metadata = {
  title: "Settings | PPI Karabuk",
}

export default function SettingsLayout({ children }: Props) {
  return <>{children}</>
}
