import { axiosBlog } from "@/lib/axiosBlog"
import { ILatestNews, NewsDataAttributes } from "@/types"
import getDate from "@/utils/api/getDate"
import Image from "next/image"
import Link from "next/link"
import { useQuery } from "react-query"

export default function PopularNews() {
  const { data, isLoading, isError } = useQuery(
    "popularNews",
    (): Promise<NewsDataAttributes[]> =>
      axiosBlog
        .get<ILatestNews>(
          "/blogs?populate=*&pagination[pageSize]=3&pagination[page]=1&sort=visited:desc"
        )
        .then((res) => res.data.data)
  )

  if (isLoading) return <LoadingNews />

  if (isError) return <LoadingNews />

  if (data)
    return (
      <>
        {data.map((item, index) => (
          <Link
            href={`/article/${item.attributes.slug}`}
            key={index}
            className="w-full h-fit flex flex-col"
          >
            <div className="w-full h-48 relative">
              <Image
                src={
                  process.env.NEXT_PUBLIC_BLOG_API +
                  item.attributes.hero.data.attributes.formats.medium.url
                }
                alt=""
                fill
                quality={100}
                sizes="(max-width: 768px) 80vw, (max-width: 1200px) 50vw, 33vw"
                className="object-cover"
              />
            </div>
            <p className="text-neutral-400 font-light pt-2 text-sm">
              <span className="text-red-400 font-semibold uppercase">
                {item.attributes.type.data.attributes.name}
              </span>
              {` - ${getDate(item.attributes.publishedAt)} by `}
              <span className="font-semibold text-black">
                {item.attributes.author.data.attributes.firstname}
              </span>
            </p>
            <h4 className="text-left line-clamp-4 font-bold">{item.attributes.title}</h4>
          </Link>
        ))}
      </>
    )

  return <LoadingNews />
}

function LoadingNews() {
  const data = Array.from(Array(3))

  return data.map((e, index) => (
    <div key={index} className="flex flex-col lg:flex-row gap-4 py-4 animate-pulse">
      <div className="aspect-video h-48 bg-neutral-200"></div>
      <div className="flex w-full gap-1 flex-col">
        <div className="h-4 w-1/2 bg-neutral-200"></div>
        <div className="w-full h-8 bg-neutral-200"></div>
        <div className="h-6 w-full bg-neutral-200"></div>
        <div className="h-6 w-full bg-neutral-200"></div>
        <div className="h-6 w-full bg-neutral-200"></div>
        <div className="h-6 w-full bg-neutral-200"></div>
        <div className="mt-auto h-3 w-1/5 bg-neutral-200"></div>
      </div>
    </div>
  ))
}
