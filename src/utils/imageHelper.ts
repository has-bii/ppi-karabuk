export default function imageHelper(imageSrc: string): string {
  return process.env.NODE_ENV !== "development"
    ? (process.env.NEXT_PUBLIC_IMG_PROVIDER_URL as string) + imageSrc
    : imageSrc
}
