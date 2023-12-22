"use client"

import { axiosBlog } from "@/lib/axiosBlog"
import { ILatestNews, NewsDataAttributes } from "@/types"
import getDate from "@/utils/getDate"
import { faCircleNotch, faCircleXmark, faSearch } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import Image from "next/image"
import Link from "next/link"
import { useEffect, useState } from "react"
import qs from "qs"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import Category from "@/components/Article/Category"
import Type from "@/components/Article/Type"
import Tags from "@/components/Article/Tags"

interface Query {
  populate: "*"
  pagination: {
    pageSize: number
    page: number
  }
  filters: {
    $and?: (ITitle | ICategory | ITag | IType)[]
  }
}

interface ITitle {
  title: {
    $containsi: string
  }
}

interface IType {
  type: {
    name: string
  }
}

interface ICategory {
  category: {
    name: string
  }
}

interface ITag {
  tags: {
    name: {
      $in: string[]
    }
  }
}

// Main Component

export default function Page() {
  const params = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()
  const [m, setM] = useState<boolean>(true)
  const [data, setData] = useState<ILatestNews | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [title, setTitle] = useState<string>(params.get("title") || "")
  const [category, setCategory] = useState<string>(params.get("category") || "")
  const [tags, setTags] = useState<string[]>(params.getAll("tags") || [])
  const [type, setType] = useState<string>(params.get("type") || "")

  async function fetchData() {
    try {
      setLoading(true)

      const query: Query = {
        populate: "*",
        pagination: {
          pageSize: 10,
          page: 1,
        },
        filters: {
          $and: [],
        },
      }

      addQuery(query)

      const res = await axiosBlog.get<ILatestNews>(
        "/blogs?" + qs.stringify(query, { encodeValuesOnly: true })
      )

      if (res.data) setData(res.data)
    } catch (error) {
      console.error("Failed to get Articles!")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (m) setM(false)
    else {
      const _query = []

      if (title) _query.push("title=" + title)
      if (tags.length > 0) tags.forEach((value) => _query.push("tags=" + value))
      if (category) _query.push("category=" + category)
      if (type) _query.push("type=" + type)

      router.replace(pathname + `${_query.length > 0 ? "?" : ""}${_query.join("&")}`, {
        scroll: false,
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [title, tags, category, type])

  function addQuery(query: Query) {
    const title = params.get("title")
    const type = params.get("type")
    const category = params.get("category")
    const tags = params.getAll("tags")

    const and: (ITitle | ICategory | ITag | IType)[] = []

    if (title) and.push({ title: { $containsi: title } })

    if (type) and.push({ type: { name: type } })

    if (category) and.push({ category: { name: category } })

    if (tags) and.push({ tags: { name: { $in: tags } } })

    if (and.length > 0) query.filters.$and = and
  }

  return (
    <section className="container spacing px-4 md:px-0">
      <h1>Pojok Tulisan</h1>
      <div className="flex flex-col lg:flex-row gap-16">
        <div className="w-full lg:w-3/4">
          <div className="flex flex-col lg:flex-row gap-2 w-full">
            <div className="inline-flex w-full gap-4 justify-between bg-white border-2 border-[#000] px-4 py-2">
              <input
                type="text"
                placeholder="Cari tulisan"
                className="w-full"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") fetchData()
                }}
              />
              <button onClick={() => fetchData()}>
                {loading ? (
                  <FontAwesomeIcon icon={faCircleNotch} size="xl" className="animate-spin" />
                ) : (
                  <FontAwesomeIcon icon={faSearch} size="xl" />
                )}
              </button>
            </div>
            <div className="inline-flex gap-2">
              <Type type={type} setType={setType} />
              <Category category={category} setCategory={setCategory} />
              <Tags tags={tags} setTags={setTags} />
            </div>
          </div>

          {/* Tags */}
          {tags.length > 0 && (
            <div className="w-fit flex-wrap inline-flex items-center gap-1 pt-2">
              <div className="font-bold text-black uppercase h-fit">tags :</div>
              {tags.map((item, index) => (
                <div
                  key={index}
                  className="px-2 py-1 bg-neutral-300 text-neutral-600 text-sm hover:cursor-pointer inline-flex gap-1 items-center"
                  onClick={() => setTags(tags.filter((value) => value !== item))}
                >
                  #{item}
                  <FontAwesomeIcon icon={faCircleXmark} size="1x" className="text-neutral-400" />
                </div>
              ))}
            </div>
          )}
          {/* Tags end */}

          {/* Main */}

          <div className="flex flex-col mt-4 divide-y">
            {loading ? (
              <LoadingNews />
            ) : data?.data.length === 0 ? (
              <div className="w-full h-28 flex justify-center items-center">
                There is no article.
              </div>
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
