"use client"

import NavSide from "@/components/app/settings/NavSide"
import SettingsProfile from "@/components/app/settings/pages/SettingsProfile"
import { useSearchParams } from "next/navigation"
import React, { useState } from "react"

export type NavSideType = "PROFILE" | "PASSWORD" | "ACTIVATE"

export default function Settings() {
  const searchParams = useSearchParams()
  const param = searchParams.get("q")
  const [navLocation, setNavLocation] = useState<NavSideType>(
    checkParams(param) ? (param as NavSideType) : "PROFILE"
  )

  return (
    <section className="flex flex-row h-full">
      <NavSide navLocation={navLocation} setNavLocation={setNavLocation} />
      <Pages location={navLocation} />
    </section>
  )
}

function Pages({ location }: { location: NavSideType }) {
  switch (location) {
    case "PROFILE":
      return <SettingsProfile />
  }
}

function checkParams(param: string | null): boolean {
  const check: NavSideType[] = ["PASSWORD", "PROFILE", "ACTIVATE"]

  return check.includes(param as NavSideType)
}
