import axiosBlog from "@/lib/axiosBlog"
import { ILatestNews } from "@/types"
import getDate from "@/utils/getDate"
import Image from "next/image"
import Link from "next/link"
import qs from "qs"

export default async function Page({ params }: { params: { slug: string } }) {
  const data = await getData(params.slug)

  if (data === undefined)
    return (
      <section className="container">
        <h1>Article not found!</h1>
      </section>
    )
  else
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

async function getData(slug: string) {
  const query = qs.stringify({
    populate: "*",
    pagination: {
      pageSize: 1,
    },
    filters: {
      slug: {
        $eq: slug,
      },
    },
  })
  const res = await axiosBlog.get<ILatestNews>(`/blogs?${query}`)

  if (res.data.data.length === 0) return undefined

  return res.data.data[0]
}

export async function generateStaticParams() {
  const query = qs.stringify({
    populate: "*",
    pagination: {
      pageSize: 25,
      pagination: 1,
    },
  })
  const posts = await axiosBlog.get<ILatestNews>(`/blogs?${query}`)

  return posts.data.data.map((post) => ({
    slug: post.attributes.slug,
  }))
}
