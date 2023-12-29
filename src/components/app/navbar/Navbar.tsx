import { Nav, Role } from "@prisma/client"
import Logo from "../../Logo"
import NavListApp from "./NavListApp"
import User from "./User"
import prisma from "@/lib/prisma"

export default async function Navbar({ user }: UserProps) {
  const navs: Nav[] = await fetchData(user.role)
  return (
    <nav className="w-full flex flex-row items-center gap-14">
      <div className="hidden lg:block">
        <Logo />
      </div>
      <NavListApp navs={navs} />
      <User user={user} />
    </nav>
  )
}

async function fetchData(role: Role): Promise<Nav[]> {
  const navs = await prisma.nav.findMany({
    where: { isActive: true, role, navlistId: { equals: null } },
    include: { navitems: { where: { isActive: true } } },
  })

  return navs
}
