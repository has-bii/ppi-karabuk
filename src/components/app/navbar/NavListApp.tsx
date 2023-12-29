"use client"

import { useState } from "react"
import NavItem from "./NavItem"
import { Nav } from "@prisma/client"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faBars, faRightFromBracket, faXmark } from "@fortawesome/free-solid-svg-icons"
import { useToast } from "@/context/ToastContext"
import axios from "axios"
import { AuthResponse } from "@/types/auth"
import { useRouter } from "next/navigation"

type Props = {
  navs: Nav[]
}

export default function NavListApp({ navs }: Props) {
  const [show, setShow] = useState<boolean>(false)
  const { pushToast } = useToast()
  const router = useRouter()

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

  return (
    <section className="">
      <button className="block lg:hidden text-black" onClick={() => setShow(true)}>
        <FontAwesomeIcon icon={faBars} size="xl" />
      </button>
      <div
        className={`flex flex-col lg:flex-row p-8 lg:p-0 gap-2 lg:gap-6 fixed lg:static lg:h-full lg:w-fit h-screen w-screen bg-black lg:bg-white text-white lg:text-black top-0 z-10 transition-[left] duration-200 ease-in ${
          show ? "left-0" : "-left-full"
        }`}
      >
        <div className="lg:hidden inline-flex justify-between gap-4">
          <button className="block text-white w-fit" onClick={() => setShow(false)}>
            <FontAwesomeIcon icon={faXmark} size="xl" />
          </button>

          <button className="text-white w-fit inline-flex gap-2" onClick={() => logout()}>
            <FontAwesomeIcon icon={faRightFromBracket} size="xl" />
            <span>Logout</span>
          </button>
        </div>

        <div className="lg:hidden relative h-28  aspect-video text-center">
          <h1 className="text-white absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            PPI Karabuk
          </h1>
        </div>

        <NavItem name="Dashboard" url={"/app"} type="ITEM" setShow={setShow} />
        <NavItem name="Verify" url={"/app/verify"} type="ITEM" setShow={setShow} />
        <NavItem name="Profile" url={"/app/profile"} type="ITEM" setShow={setShow} />
        {navs.map((nav, i) => (
          <NavItem key={i} url={nav.url || ""} name={nav.name} type={nav.type} setShow={setShow} />
        ))}
      </div>
    </section>
  )
}
