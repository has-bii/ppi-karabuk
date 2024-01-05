import { Nav, Role } from "@prisma/client"
import Logo from "../../Logo"
import NavListApp from "./NavListApp"
import User from "./User"
import prisma from "@/lib/prisma"
import { UserProps } from "@/types/user"

export const fetchCache = "force-no-store"

type Props = {
  user: UserProps
}

export default async function Navbar({ user }: Props) {
  const navs: Nav[] = await fetchData(user.role)

  async function fetchData(role: Role[]): Promise<Nav[]> {
    const navs = await prisma.nav.findMany({
      where: { isActive: true, role: { in: role }, navlistId: { equals: null } },
      include: { navitems: { where: { isActive: true } } },
    })

    return navs
  }

  return (
    <nav className="w-full flex flex-row items-center gap-14 px-4 py-4 lg:px-8 lg:py-4 border-b bg-white drop-shadow z-20">
      <div className="hidden lg:block">
        <Logo />
      </div>
      <NavListApp navs={navs} />
      <User user={user} />
    </nav>
  )
}
