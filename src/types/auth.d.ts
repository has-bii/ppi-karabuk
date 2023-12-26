type AuthBody = {
  name?: string
  email?: string
  studentId?: string
  kimlikId?: string
  password?: string
}

type AuthResponse = {
  status: "ok" | "error"
  message: string
}

export { AuthBody, AuthResponse }
