export type AuthBody = {
  name?: string
  email?: string
  studentId?: string
  kimlikId?: string
  password?: string
}

export type InstagramData = {
  id: string
  caption: string
  media_type: "IMAGE" | "VIDEO" | "CAROUSEL_ALBUM"
  media_url: string
  thumbnail_url: string
  permalink: string
}

export interface ResponseData {
  message: string
}

export interface AuthLoginResponseData extends ResponseData {
  error?: {
    email?: string
    password?: string
  }
}

export interface AuthRegisterResponseData extends ResponseData {
  error?: {
    email?: string
    kimlikId?: string
    studentId?: string
  }
}

export interface AuthForgotResponseData extends ResponseData {
  error?: {
    email?: string
  }
}

export type InputData = {
  value: string
  validation: string
}

export type ToastStatus = "danger" | "error" | "normal" | "success"

export type TToastContext = {
  pushToast: (message: string, status: ToastStatus) => void
}

export type ToastData = {
  message: string
  status: ToastStatus
}
