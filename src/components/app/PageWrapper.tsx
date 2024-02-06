"use client"

import { usePathname, useRouter } from "next/navigation"
import React, { ReactNode } from "react"

type Props = {
  children: ReactNode
  url: string
  navSideItems: NavSideItems[]
}

export type NavSideItems = {
  url: string
  text: string
}

export default function PageWrapper({ children, navSideItems, url }: Props) {
  const pathname = usePathname()
  const router = useRouter()

  return (
    <div className="h-full w-full flex z-0 scrollbar-thin">
      <div className="container bg-white p-8 lg:rounded-xl border lg:my-14 lg:drop-shadow z-0 scrollbar-thin">
        <section className="flex flex-col lg:flex-row h-fit lg:h-full static scrollbar-thin">
          <aside className="lg:w-fit w-full h-full">
            <ul className="pr-8 flex flex-row lg:flex-col gap-2 mb-4 overflow-x-auto scrollbar-none snap-x">
              {/* NavItem */}
              {navSideItems.map((item, index) => (
                <li key={index} className="snap-start w-fit lg:w-full">
                  <div
                    className={`capitalize w-full whitespace-nowrap rounded-md px-3 py-1.5 hover:cursor-pointer text-neutral-800 ${
                      pathname.includes(item.url) ? "bg-neutral-100" : ""
                    }`}
                    onClick={() => router.push("/app" + url + item.url)}
                  >
                    {item.text}
                  </div>
                </li>
              ))}
              {/* NavItem End */}
            </ul>
          </aside>
          <div className="app-page scrollbar-thin">{children}</div>
        </section>
      </div>
    </div>
  )
}
