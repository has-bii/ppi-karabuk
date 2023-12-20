import { axiosBlog, axiosBlogUpdate } from "@/lib/axiosBlog"
import { ILatestNews } from "@/types"
import getDate from "@/utils/getDate"
import { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import qs from "qs"
import { cache } from "react"

export const revalidate = 3600 // revalidate the data at most every hour

export default async function Page({ params }: { params: { slug: string } }) {
  const data = await getData(params.slug)

  if (data === undefined)
    return (
      <section className="container my-auto">
        <h1>Article not found!</h1>
      </section>
    )
  else {
    updateBlogVisited(data.id, data.attributes.visited)

    return (
      <section className="container spacing text-center">
        <p className="text-sm uppercase font-semibold text-neutral-400 mb-4">
          <span className="text-red-400">{data.attributes.category.data.attributes.name}</span>
          {` | `}
          <span>{getDate(data.attributes.publishedAt)}</span>
        </p>
        <h2>{data.attributes.title}</h2>

        <div className="relative aspect-video mb-6">
          <Image
            src={
              process.env.NEXT_PUBLIC_BLOG_API +
              data.attributes.hero.data.attributes.formats.large.url
            }
            alt=""
            fill
            quality={100}
            priority
            className="object-cover"
            sizes="(max-width: 768px) 33vw, 100vw"
          />
        </div>

        <div className="w-full px-4 md:px-0 md:w-[768px] mx-auto text-justify text-neutral-600">
          {data.attributes.content.map((item, index) => {
            if (item.type === "paragraph")
              return (
                <p key={index} className="py-2">
                  {item.children.map((it, index) => {
                    if (it.type === "text") return it.text
                  })}
                </p>
              )
          })}

          <p className="text-left font-semibold capitalize">
            Author:&nbsp;
            <Link
              href={`https://www.instagram.com/${
                data.attributes.author.data.attributes.username ||
                data.attributes.author.data.attributes.firstname
              }`}
              target="_blank"
              className="text-red-400"
            >
              {data.attributes.author.data.attributes.firstname +
                " " +
                data.attributes.author.data.attributes.lastname}
            </Link>
          </p>
          <p className="text-left font-semibold capitalize">
            Editor:&nbsp;
            <Link
              href={`https://www.instagram.com/${
                data.attributes.editor.data.attributes.username ||
                data.attributes.editor.data.attributes.firstname
              }`}
              target="_blank"
              className="text-red-400"
            >
              {data.attributes.editor.data.attributes.firstname +
                " " +
                data.attributes.editor.data.attributes.lastname}
            </Link>
          </p>

          <p className="text-xl font-semibold capitalize mt-6 mb-1">tags</p>
          <div className="flex flex-wrap gap-2">
            {data.attributes.tags.data.map((item, index) => (
              <div key={index} className="px-4 py-2 bg-neutral-200 text-sm">
                {item.attributes.name}
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }
}

async function updateBlogVisited(id: number, visited: string | null) {
  let updatedVisited = visited

  if (updatedVisited === null) updatedVisited = "1"
  else updatedVisited = (parseInt(updatedVisited) + 1).toString()

  axiosBlogUpdate.put("/blogs/" + id, {
    data: {
      visited: updatedVisited,
    },
  })
}

const getData = cache(async (slug: string) => {
  const query = qs.stringify(
    {
      populate: "*",
      pagination: {
        pageSize: 1,
      },
      filters: {
        slug: {
          $eq: slug,
        },
      },
    },
    {
      encodeValuesOnly: true,
    }
  )
  const res = await axiosBlog.get<ILatestNews>(`/blogs?${query}`)

  if (res.data.data.length === 0) return undefined

  return res.data.data[0]
})

export async function generateMetadata({
  params,
}: {
  params: { slug: string }
}): Promise<Metadata> {
  const data = await getData(params.slug)

  return {
    title: "Article | PPI Karabuk",
    metadataBase: new URL(process.env.BASE_URL || "http://localhost:3000/"),
    description: data?.attributes.excerpt,
    openGraph: {
      title: data?.attributes.title,
      url: "www.ppi-karabuk.com",
      description: data?.attributes.excerpt,
      images: `${process.env.NEXT_PUBLIC_BLOG_API}${data?.attributes.hero.data.attributes.formats.thumbnail.url}`,
    },
  }
}
