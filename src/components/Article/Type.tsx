import { axiosBlog } from "@/lib/axiosBlog"
import React, { Dispatch, SetStateAction, useState } from "react"
import { useQuery } from "react-query"

type Props = {
  setType: Dispatch<SetStateAction<string>>
  type: string
}

interface TypeData {
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
  data: TypeData[]
  meta: Meta
}

export default function Type({ setType, type }: Props) {
  const [select, setSelect] = useState<boolean>(false)
  const { data, isLoading, isError } = useQuery(
    "types",
    (): Promise<TypeData[]> =>
      axiosBlog
        .get<ResData>("/types")
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
        className="bg-black text-white px-4 py-2 relative hover:cursor-pointer capitalize w-full lg:w-fit text-center"
        onClick={() => {
          setSelect(!select)
        }}
      >
        <span>{type || "Type"}</span>
        {select && (
          <div className="absolute top-14 left-1/2 -translate-x-1/2 border-2 border-black bg-white z-20 text-black flex flex-col divide-y divide-neutral-200 max-h-44 overflow-x-hidden overflow-y-auto">
            {data.map((item, index) => (
              <div
                key={index}
                className={`px-4 py-2 font-semibold whitespace-nowrap ${
                  item.attributes.name === type ? "bg-sky-100" : ""
                }`}
                onClick={() => {
                  if (type === item.attributes.name) setType("")
                  else setType(item.attributes.name)
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
