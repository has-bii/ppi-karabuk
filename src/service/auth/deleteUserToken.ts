"use server"

import { cookies } from "next/headers"
import { redirect } from "next/navigation"

export default async function deleteUserToken() {
  cookies().delete("ppik_user")

  redirect("/auth")
}
