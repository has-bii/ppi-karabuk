"use server"

import prisma from "@/lib/prisma"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"

export default async function logout() {
  prisma.token.delete({ where: { value: cookies().get("ppik_user")?.value as string } })

  cookies().delete("ppik_user")

  redirect("/auth")
}
