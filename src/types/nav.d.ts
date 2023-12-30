type NavResponse =
  | {
      message: string
      status: "ok"
      data: ({
        navitems: {
          id: number
          name: string
          role: $Enums.Role
          type: $Enums.NavListType
          isActive: boolean
          url: string | null
          navlistId: number | null
        }[]
      } & {
        id: number
        name: string
        role: $Enums.Role
        type: $Enums.NavListType
        isActive: boolean
        url: string | null
        navlistId: number | null
      })[]
    }
  | {
      status: "error"
      message: string
    }

export { NavResponse }
