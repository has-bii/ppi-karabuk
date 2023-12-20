"use client"

import { axiosBlog } from "@/lib/axiosBlog"
import { ILatestNews, NewsDataAttributes } from "@/types"
import getDate from "@/utils/getDate"
import { faSearch } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import Image from "next/image"
import Link from "next/link"
import { useEffect, useState } from "react"
import qs from "qs"

export default function Page() {
  const [data, setData] = useState<ILatestNews | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [query, setQuery] = useState<{}>({
    populate: "*",
    pagination: {
      pageSize: 10,
      page: 1,
    },
    filters: {},
  })

  async function fetchData() {
    try {
      const res = await axiosBlog.get<ILatestNews>(
        "/blogs?" + qs.stringify(query, { encodeValuesOnly: true })
      )

      if (res.data) {
        setData(res.data)
        setLoading(false)
      }
    } catch (error) {}
  }

  useEffect(() => {
    fetchData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <section className="container spacing px-4 md:px-0">
      <h1>Pojok Tulisan</h1>
      <div className="flex flex-col lg:flex-row gap-16">
        <div className="w-full lg:w-3/4">
          <div className="inline-flex gap-2 w-full">
            <div className="inline-flex w-full gap-4 justify-between bg-white border-2 border-[#000] px-4 py-2">
              <input type="text" placeholder="Cari tulisan" className="w-full" />
              <FontAwesomeIcon icon={faSearch} size="xl" />
            </div>
            <div className="bg-black text-white px-4 py-2">Tag</div>
            <div className="bg-black text-white px-4 py-2">Category</div>
          </div>

          {/* Main */}

          <div className="flex flex-col mt-4 divide-y">
            {loading ? (
              <LoadingNews />
            ) : (
              data?.data.map((item, index) => (
                <div key={index} className="flex flex-col lg:flex-row gap-4 py-4">
                  <Link
                    href={"/article/" + item.attributes.slug}
                    className="aspect-video h-48 relative"
                  >
                    <Image
                      src={
                        process.env.NEXT_PUBLIC_BLOG_API +
                        item.attributes.hero.data.attributes.formats.medium.url
                      }
                      alt=""
                      fill
                      quality={100}
                      priority
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover"
                    />
                  </Link>
                  <div className="flex flex-col">
                    <p className="text-neutral-400 font-light text-sm">
                      <span className="text-red-400 font-semibold uppercase">
                        {item.attributes.type.data.attributes.name}
                      </span>
                      {` - ${getDate(item.attributes.publishedAt)}`}
                    </p>
                    <Link href={"/article/" + item.attributes.slug}>
                      <h4 className="line-clamp-2 hover:underline">{item.attributes.title}</h4>
                    </Link>
                    <p className="text-left line-clamp-4 text-neutral-400">
                      {item.attributes.excerpt}
                    </p>
                    <p className="text-neutral-400 font-light text-sm mt-auto">
                      {`by `}
                      <span className="font-semibold text-black">
                        {item.attributes.author.data.attributes.firstname +
                          " " +
                          item.attributes.author.data.attributes.lastname}
                      </span>
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Main end */}
        </div>
        <div className="w-full lg:w-1/4">
          <h3 className="text-left mb-4">Popular Articles</h3>
          <div className="flex flex-col gap-2">
            <PopularNews />
          </div>
        </div>
      </div>
    </section>
  )
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

function LoadingPopularNews() {
  return (
    <>
      <div className="w-full h-48 bg-neutral-200 animate-pulse"></div>
      <div className="w-full h-48 bg-neutral-200 animate-pulse"></div>
    </>
  )
}

function PopularNews() {
  const [data, setData] = useState<NewsDataAttributes[]>([])
  const [loading, setLoading] = useState<boolean>(true)

  async function fetchData() {
    try {
      const res = await axiosBlog.get<ILatestNews>(
        "/blogs?populate=*&pagination[pageSize]=3&pagination[page]=1&sort=visited:desc"
      )

      if (res.data) {
        setData(res.data.data)
        setLoading(false)
      }
    } catch (error) {}
  }

  useEffect(() => {
    fetchData()
  }, [])

  if (loading) return <LoadingPopularNews />

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
}
