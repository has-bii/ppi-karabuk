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

  function checkPath(pathName: string, url: string): boolean {
    if (pathName.replace("/app", "") !== url) return false

    return pathName.includes(url)
  }

  if (type === "ITEM")
    return (
      <Link
        href={"/app" + url}
        className={`capitalize text-lg px-4 py-2 text-white lg:text-black ${
          checkPath(pathName, url)
            ? "font-bold bg-white/10 rounded-md lg:underline lg:underline-offset-[6px]"
            : "font-bold hover:bg-white/10 hover:rounded-md lg:hover:underline lg:hover:underline-offset-[6px]"
        }`}
        onClick={() => setShow(false)}
      >
        {name}
      </Link>
    )
}
