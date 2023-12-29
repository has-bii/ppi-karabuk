"use server"

import { cookies } from "next/headers"

export default async function logout() {
  cookies().delete("ppik_user_token")
}
