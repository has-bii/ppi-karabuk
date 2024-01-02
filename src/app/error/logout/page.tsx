"use client"

import logout from "@/utils/auth/serverActions/logout"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function Page() {
  const router = useRouter()

  useEffect(() => {
    logout().then(() => router.push("/auth"))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <h1 className="text-3xl md:text-4xl font-extrabold text-black text-center">
      Redirecting to login page...
    </h1>
  )
}
