"use client"

import deleteUserToken from "@/utils/serverActions/deleteUserToken"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function ToLogin() {
  const router = useRouter()

  useEffect(() => {
    deleteUserToken()

    router.replace("/auth")
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <h1 className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2">
      Redirecting to Login page...
    </h1>
  )
}
