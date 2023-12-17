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

// Latest News

interface NewsChild {
  text: string
  type: "text"
}

interface NewsContent {
  type: "paragraph"
  children: NewsChild[]
}

interface NewsHero {
  data: {
    id: number
    attributes: {
      name: string
      alternativeText: null | string
      caption: null | string
      width: number
      height: number
      formats: {
        large: {
          ext: string
          url: string
          hash: string
          mime: string
          name: string
          path: null | string
          size: number
          width: number
          height: number
        }
        small: {
          ext: string
          url: string
          hash: string
          mime: string
          name: string
          path: null | string
          size: number
          width: number
          height: number
        }
        medium: {
          ext: string
          url: string
          hash: string
          mime: string
          name: string
          path: null | string
          size: number
          width: number
          height: number
        }
        thumbnail: {
          ext: string
          url: string
          hash: string
          mime: string
          name: string
          path: null | string
          size: number
          width: number
          height: number
        }
      }
      hash: string
      ext: string
      mime: string
      size: number
      url: string
      previewUrl: null | string
      provider: string
      provider_metadata: null | string
      createdAt: string
      updatedAt: string
    }
  }
}

interface NewsTag {
  id: number
  attributes: {
    name: string
    createdAt: string
    updatedAt: string
    publishedAt: string
  }
}

interface NewsDataAttributes {
  id: number
  attributes: {
    title: string
    slug: string
    excerpt: string
    content: NewsContent[]
    createdAt: string
    updatedAt: string
    publishedAt: string
    hero: NewsHero
    type: {
      data: {
        id: number
        attributes: {
          name: string
          createdAt: string
          updatedAt: string
          publishedAt: string
        }
      }
    }
    category: {
      data: {
        id: number
        attributes: {
          name: string
          createdAt: string
          updatedAt: string
          publishedAt: string
        }
      }
    }
    tags: {
      data: NewsTag[]
    }
    author: {
      data: {
        id: number
        attributes: {
          firstname: string
          lastname: string
          username: null | string
          preferedLanguage: null | string
          createdAt: string
          updatedAt: string
        }
      }
    }
    editor: {
      data: {
        id: number
        attributes: {
          firstname: string
          lastname: string
          username: null | string
          preferedLanguage: null | string
          createdAt: string
          updatedAt: string
        }
      }
    }
  }
}

interface NewsMeta {
  pagination: {
    page: number
    pageSize: number
    pageCount: number
    total: number
  }
}

interface NewsItem {
  id: number
  attributes: NewsDataAttributes
}

export interface ILatestNews {
  data: NewsDataAttributes[]
  meta: NewsMeta
}
