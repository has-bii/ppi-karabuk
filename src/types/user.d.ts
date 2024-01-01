import { Role } from "@prisma/client"

type UserProps = {
  user: {
    id: string
    name: string
    role: Role[]
    img: string | null
  }
}

type UserFetchResponse =
  | {
      message: string
      status: "ok"
      data: {
        id: string
        name: string
        role: Role[]
        img: string | null
      }
    }
  | {
      message: string
      status: "error"
      error: {}
    }

export { UserProps, UserFetchResponse }
