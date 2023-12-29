"use client"

import Image from "next/image"
import dummy from "@/images/dummy-pp.png"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faRightFromBracket, faUser } from "@fortawesome/free-solid-svg-icons"
import { useEffect, useRef, useState } from "react"
import { useToast } from "@/context/ToastContext"
import { useRouter } from "next/navigation"
import axios from "axios"
import { AuthResponse } from "@/types/auth"

export default function User({ user }: UserProps) {
  const [show, setShow] = useState<boolean>(false)
  const { pushToast } = useToast()
  const router = useRouter()
  const ref = useRef<HTMLDivElement>(null)

  async function logout() {
    pushToast("Logging out...", "normal")

    await axios
      .post<AuthResponse>("/api/auth/logout")
      .then((res) => {
        const { data } = res

        if (data.status === "ok") pushToast(data.message, "success")

        router.push("/auth")
      })
      .catch(({ response }) => {
        const { data }: { data: AuthResponse } = response

        if (data.status === "error") pushToast(data.message, "error")
      })
  }

  useEffect(() => {
    function handleOutsideClick(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        // Clicked outside the dropdown, so close it
        setShow(false)
      }
    }

    document.addEventListener("click", handleOutsideClick)

    return () => {
      document.removeEventListener("click", handleOutsideClick)
    }
  }, [ref])

  return (
    <div ref={ref} className="ml-auto inline-flex gap-2 items-center relative">
      <div className="capitalize font-semibold text-xl hidden md:block">
        {user.name.split(" ").slice(0, 2).join(" ")}
      </div>
      <div
        className="h-10 w-10 relative rounded-full overflow-hidden hover:cursor-pointer"
        onClick={() => setShow(!show)}
      >
        <Image src={user.img || dummy} alt="" fill sizes="10vw" className="object-cover" />
      </div>
      {show && (
        <ul className="absolute top-12 right-0 w-fit h-fit bg-white rounded-md border border-black divide-y divide-black overflow-hidden">
          <li>
            <button
              className="w-full inline-flex gap-2 items-center px-4 py-2 hover:bg-black hover:text-white"
              onClick={() => {
                router.push("/app/profile")
                setShow(false)
              }}
            >
              <FontAwesomeIcon icon={faUser} />
              <span>Profile</span>
            </button>
          </li>
          <li>
            <button
              className="w-full inline-flex gap-2 items-center px-4 py-2 hover:bg-black hover:text-white"
              onClick={() => logout()}
            >
              <FontAwesomeIcon icon={faRightFromBracket} />
              <span>Logout</span>
            </button>
          </li>
        </ul>
      )}
    </div>
  )
}
