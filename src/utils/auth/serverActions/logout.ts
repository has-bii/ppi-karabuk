"use server"

import prisma from "@/lib/prisma"
import { cookies } from "next/headers"

export default async function logout() {
  const token = cookies().get("ppik_user")?.value

  if (token)
    prisma.token
      .delete({ where: { value: token } })
      .then()
      .catch()

  cookies().delete("ppik_user")
}
