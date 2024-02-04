import { env } from "process"

export default function getFileServiceURL(path: string): string {
  return env.NODE_ENV !== "development" ? env.NEXT_PUBLIC_IMG_PROVIDER_URL + path : path
}
