import { Nav, Role } from "@prisma/client"
import Logo from "../../Logo"
import NavListApp from "./NavListApp"
import User from "./User"
import prisma from "@/lib/prisma"
import { UserProps } from "@/types/user"
import { NavType } from "./NavType"

export const fetchCache = "force-no-store"

type Props = {
  user: UserProps
}

export default async function Navbar({ user }: Props) {
  const navs = await fetchData(user.role)

  return (
    <nav className="w-full flex flex-row items-center gap-14 px-4 py-4 lg:px-8 lg:py-4 border-b bg-white drop-shadow z-20">
      <div className="hidden lg:block">
        <Logo />
      </div>
      <NavListApp navs={navs} userRole={user.role} />
      <User user={user} />
    </nav>
  )
}

// Fetch Data
async function fetchData(role: Role[]) {
  const navs = await prisma.nav.findMany({
    where: { isActive: true, role: { in: role }, navlistId: { equals: null } },
    include: { navitems: { where: { isActive: true } } },
  })

  const mapped: NavType[] = navs.map((nav) => {
    const temp: any = {
      id: nav.id,
      isActive: nav.isActive,
      role: nav.role,
      type: nav.type,
    }

    if (nav.type === "DROPDOWN") {
      temp.navlistId = nav.navlistId as number
      temp.navitems = nav.navitems
    }

    temp.url = nav.url

    return temp
  })

  return mapped
}
