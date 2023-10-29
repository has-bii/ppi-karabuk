"use client"

import { useEffect, useState } from "react"
import { Nav } from "@prisma/client"
import axios from "axios"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faBars, faXmark } from "@fortawesome/free-solid-svg-icons"
import { usePathname } from "next/navigation"
import Link from "next/link"

function renderNavdata(data: Nav, pathName: string) {
  if (data.type === "ITEM")
    return (
      <Link href={data.url as string} className={pathName === data.url ? "active" : ""}>
        {data.name}
      </Link>
    )

  return ""
}

export default function Navlist() {
  const [navdata, setNavdata] = useState<Nav[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [showNav, setShowNav] = useState<boolean>(false)
  const pathName = usePathname()

  async function fetchNavdata() {
    try {
      const res = await axios.get<{ message: string; data: Nav[] }>("/api/nav/fetch")

      setNavdata(res.data.data)
    } catch (error) {
      return null
    }
  }

  useEffect(() => {
    fetchNavdata()
  }, [])

  useEffect(() => {
    if (navdata.length > 0) setLoading(false)
  }, [navdata])

  return (
    <div className="navlist-container">
      <button className="block lg:hidden text-black" onClick={() => setShowNav(true)}>
        <FontAwesomeIcon icon={faBars} size="xl" />
      </button>
      <ul className={`navlist ${showNav ? "active" : ""}`}>
        <li className="block lg:hidden text-white">
          <button onClick={() => setShowNav(false)}>
            <FontAwesomeIcon icon={faXmark} size="xl" />
          </button>
        </li>
        {loading ? (
          <li>
            <p className="navlist-data">Loading...</p>
          </li>
        ) : (
          navdata.map((data, index) => <li key={index}>{renderNavdata(data, pathName)}</li>)
        )}
        <li className="mt-auto mb-4 block lg:hidden">
          <button className="button white">login</button>
        </li>
      </ul>
    </div>
  )
}
