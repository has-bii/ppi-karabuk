"use client"

import { faXmark } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { Dispatch, ReactNode, SetStateAction } from "react"

type Props = {
  children: ReactNode
  title: string
  show: boolean
  setShow: Dispatch<SetStateAction<boolean>>
}

export default function Modal({ children, title = "", show, setShow }: Props) {
  return (
    <div
      className={`z-40 fixed top-0 left-0 w-full h-full bg-black/50 justify-center items-center ${
        show ? "flex" : "hidden"
      }`}
    >
      <div className="p-6 bg-white rounded-2xl flex flex-col gap-4 min-w-[24rem]">
        <div className="text-xl font-bold capitalize inline-flex items-center justify-between">
          <span>{title}</span>
          <FontAwesomeIcon
            icon={faXmark}
            className="text-neutral-600 hover:cursor-pointer"
            onClick={() => setShow(false)}
          />
        </div>
        <div>{children}</div>
      </div>
    </div>
  )
}
