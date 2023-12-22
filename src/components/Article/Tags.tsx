import { axiosBlog } from "@/lib/axiosBlog"
import React, { Dispatch, SetStateAction, Suspense, useEffect, useState } from "react"

type Props = {
  setTags: Dispatch<SetStateAction<string[]>>
  tags: string[]
}

interface TagsData {
  id: number
  attributes: {
    name: string
  }
}

interface Meta {
  pagination: {
    page: number
    pageSize: number
    pageCount: number
    total: number
  }
}

interface ResData {
  data: TagsData[]
  meta: Meta
}

export default function Tags({ setTags, tags }: Props) {
  const [data, setData] = useState<TagsData[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [select, setSelect] = useState<boolean>(false)

  async function fetchData() {
    try {
      const res = await axiosBlog.get<ResData>("/tags")

      if (res.data) setData(res.data.data)
    } catch (error) {
      console.error("Failed to get Tags!")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  if (loading)
    return (
      <div className="bg-neutral-400 text-neutral-600 px-4 py-2 w-full lg:w-fit text-center">
        Loading...
      </div>
    )

  return (
    <div
      className="bg-black text-white px-4 py-2 relative hover:cursor-pointer capitalize w-full lg:w-fit text-center"
      onClick={() => {
        setSelect(!select)
      }}
    >
      <span>Tags</span>
      {select && (
        <div className="absolute top-14 left-1/2 -translate-x-1/2 border-2 border-black bg-white z-20 text-black flex flex-col divide-y divide-neutral-200 max-h-44 overflow-x-hidden overflow-y-auto">
          {data.map((item, index) => (
            <div
              key={index}
              className={`px-4 py-2 font-semibold whitespace-nowrap ${
                tags.some((i) => i === item.attributes.name) ? "bg-sky-100" : ""
              }`}
              onClick={() => {
                if (tags.some((i) => i === item.attributes.name))
                  setTags(tags.filter((name) => name !== item.attributes.name))
                else setTags((prev) => [...prev, item.attributes.name])
              }}
            >
              {item.attributes.name}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
