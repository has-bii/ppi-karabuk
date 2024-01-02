import { NavSideType } from "@/app/app/settings/page"
import React from "react"
import { NavItemType } from "./NavSide"

type Props = {
  navLocation: NavSideType
  setNavLocation: React.Dispatch<React.SetStateAction<NavSideType>>
} & NavItemType

export default function NavItem({ navLocation, setNavLocation, name, text }: Props) {
  return (
    <li className=" w-full">
      <div
        className={`capitalize w-full whitespace-nowrap rounded-md px-3 py-1.5 hover:cursor-pointer text-neutral-600 ${
          navLocation === name ? "bg-neutral-100" : ""
        }`}
        onClick={() => setNavLocation(name)}
      >
        {text}
      </div>
    </li>
  )
}
