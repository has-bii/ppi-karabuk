import Profile from "@/components/app/settings/Profile"
import getUserData from "@/service/App/settings/getUserData"

import { logout } from "@/service/auth/auth"
import { redirect } from "next/navigation"

export default async function Page() {
  const data = await getUserData()

  if (data.status === "error") logout().then(() => redirect("/auth"))

  if (data.status === "ok") return <Profile userData={data.data} />
}
