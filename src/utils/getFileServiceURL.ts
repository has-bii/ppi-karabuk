import { env } from "process"

export default function getFileServiceURL(path: string): string {
  const base = env.NODE_ENV === "production" ? env.NEXT_PUBLIC_IMG_PROVIDER_URL : ""

  return base + path
}
