"use client"

import { NavListType } from "@prisma/client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import React, { Dispatch, SetStateAction } from "react"

type Props = {
  name: string
  url: string
  type: NavListType
  setShow: Dispatch<SetStateAction<boolean>>
}

export default function NavItem({ name, type, url, setShow }: Props) {
  const pathName = usePathname()

  if (type === "ITEM")
    return (
      <Link
        href={url || ""}
        className={`capitalize text-lg px-4 py-2 ${
          pathName === url
            ? "font-semibold bg-white/5 lg:bg-black text-white rounded-lg"
            : "font-normal hover:rounded-lg hover:bg-white/5 lg:hover:bg-black lg:hover:text-white"
        }`}
        onClick={() => setShow(false)}
      >
        {name}
      </Link>
    )
}
