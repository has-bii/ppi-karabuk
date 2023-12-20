"use client"

import { axiosBlog } from "@/lib/axiosBlog"
import { ILatestNews } from "@/types"
import getDate from "@/utils/getDate"
import Image from "next/image"
import Link from "next/link"
import { useEffect, useState } from "react"

export default function LatestNews() {
  const [data, setData] = useState<ILatestNews | null>(null)
  const [loading, setLoading] = useState<boolean>(true)

  async function fetchData() {
    try {
      const res = await axiosBlog.get<ILatestNews>(
        `/blogs?populate=*&pagination[pageSize]=8&pagination[page]=${
          data === null ? 1 : data.meta.pagination.page
        }`
      )

      setData(res.data)

      setLoading(false)
    } catch (error) {}
  }

  useEffect(() => {
    fetchData()
  }, [])

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {loading ? (
        <LatestNewsSkeleton />
      ) : (
        data?.data.map((item, index) => (
          <Link
            href={`/article/${item.attributes.slug}`}
            key={index}
            className="w-full h-fit flex flex-col"
          >
            <div className="w-full h-48 md:h-64 relative">
              <Image
                src={
                  process.env.NEXT_PUBLIC_BLOG_API +
                  item.attributes.hero.data.attributes.formats.medium.url
                }
                alt=""
                fill
                quality={100}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-cover grayscale hover:grayscale-0 transition-all duration-150"
              />
            </div>
            <p className="text-red-400 font-semibold uppercase pt-1">
              {item.attributes.type.data.attributes.name}
            </p>
            <h4 className="text-left line-clamp-1 font-bold">{item.attributes.title}</h4>
            <p className="text-justify text-neutral-400 line-clamp-6">{item.attributes.excerpt}</p>
            <p className="pt-2 text-neutral-400 font-light text-sm">
              {`${getDate(item.attributes.publishedAt)} by `}
              <span className="font-semibold text-black">
                {item.attributes.author.data.attributes.firstname}
              </span>
            </p>
          </Link>
        ))
      )}
    </div>
  )
}

function LatestNewsSkeleton() {
  return (
    <>
      <div className="w-full h-96 bg-gray-300 animate-pulse"></div>
      <div className="w-full h-96 bg-gray-300 animate-pulse"></div>
      <div className="w-full h-96 bg-gray-300 animate-pulse"></div>
      <div className="w-full h-96 bg-gray-300 animate-pulse"></div>
    </>
  )
}
