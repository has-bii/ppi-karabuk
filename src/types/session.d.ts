export type UserSession = {
  id: string
  name: string
  email: string
  role: Role[]
  image: string | null
}
