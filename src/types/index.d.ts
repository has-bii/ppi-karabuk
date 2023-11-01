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
