import { ReactNode } from "react"
import NavSide from "./NavSide"

export default function SettingsPageWrapper({ children }: { children: ReactNode }) {
  return (
    <div className="h-full w-full flex z-0">
      <div className="container bg-white p-8 lg:rounded-xl border lg:my-14 lg:drop-shadow z-0">
        <section className="flex flex-col lg:flex-row h-fit lg:h-full static">
          <NavSide />
          {children}
        </section>
      </div>
    </div>
  )
}
