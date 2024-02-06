import { $Enums } from "@prisma/client"

export type NavType = {
  id: number
  name: string
  role: $Enums.Role | ""
  isActive: boolean
} & (
  | {
      type: "ITEM"
      url: string
    }
  | {
      type: "DROPDOWN"
      url: string
      navItems: {
        id: number
        name: string
        role: $Enums.Role
        isActive: boolean
        type: "ITEM"
        url: string
      }[]
    }
)
