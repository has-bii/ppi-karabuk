import { axiosBlog } from "@/lib/axiosBlog"
import React, { Dispatch, SetStateAction, Suspense, useEffect, useState } from "react"
import { useQuery } from "react-query"

type Props = {
  setCategory: Dispatch<SetStateAction<string>>
  category: string
}

interface CategoryData {
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
  data: CategoryData[]
  meta: Meta
}

export default function Category({ setCategory, category }: Props) {
  const [select, setSelect] = useState<boolean>(false)
  const { data, isLoading, isError } = useQuery(
    "categories",
    (): Promise<CategoryData[]> =>
      axiosBlog
        .get<ResData>("/categories")
        .then((res) => res.data.data)
        .catch((error) => error)
  )

  if (isLoading)
    return (
      <div className="bg-neutral-400 text-neutral-600 px-4 py-2 w-full lg:w-fit text-center">
        Loading...
      </div>
    )
  if (isError)
    return (
      <div className="bg-neutral-400 text-neutral-600 px-4 py-2 w-full lg:w-fit text-center">
        Error
      </div>
    )

  if (data)
    return (
      <div
        className="bg-black text-white px-4 py-2 relative hover:cursor-pointer w-full lg:w-fit text-center"
        onClick={() => {
          setSelect(!select)
        }}
      >
        <span>{category || "Category"}</span>
        {select && (
          <div className="absolute top-14 left-1/2 -translate-x-1/2 border-2 border-black bg-white z-20 text-black flex flex-col divide-y divide-neutral-200 max-h-44 overflow-x-hidden overflow-y-auto">
            {data.map((item, index) => (
              <div
                key={index}
                className={`px-4 py-2 font-semibold whitespace-nowrap ${
                  item.attributes.name === category ? "bg-sky-100" : ""
                }`}
                onClick={() => {
                  if (category === item.attributes.name) setCategory("")
                  else setCategory(item.attributes.name)
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
