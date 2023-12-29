"use client"

import deleteUserToken from "@/utils/serverActions/deleteUserToken"
import { useRouter } from "next/navigation"

export default function ToLogin() {
  const router = useRouter()
  deleteUserToken()

  router.replace("/auth")

  return (
    <main className="relative h-screen w-screen">
      <h1 className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2">
        Redirecting to Login page...
      </h1>
    </main>
  )
}
