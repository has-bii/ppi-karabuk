import { env } from "process"

export default function getFileServiceURL(path: string): string {
  const base = env.NODE_ENV === "development" ? "" : env.NEXT_PUBLIC_IMG_PROVIDER_URL

  return base + path
}
