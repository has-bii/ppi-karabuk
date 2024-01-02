import { NavSideType } from "@/app/app/settings/page"
import React from "react"
import NavItem from "./NavItem"

type Props = {
  navLocation: NavSideType
  setNavLocation: React.Dispatch<React.SetStateAction<NavSideType>>
}

export type NavItemType = {
  name: NavSideType
  text: string
}

const items: NavItemType[] = [
  { name: "PROFILE", text: "profile" },
  { name: "ACTIVATE", text: "activate" },
  { name: "PASSWORD", text: "change password" },
]

export default function NavSide({ navLocation, setNavLocation }: Props) {
  return (
    <aside className="w-fit h-full">
      <ul className="pr-8 flex flex-col gap-2">
        {items.map((item, index) => (
          <NavItem
            key={index}
            name={item.name}
            text={item.text}
            navLocation={navLocation}
            setNavLocation={setNavLocation}
          />
        ))}
      </ul>
    </aside>
  )
}
