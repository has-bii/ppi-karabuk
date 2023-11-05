"use client"

import { InputData } from "@/types"
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { Dispatch, SetStateAction, useEffect, useState } from "react"

type Props = {
  type: "text" | "email" | "password" | "number"
  label: string
  className?: string
  required?: boolean
  data: {
    value: string
    validation: string
  }
  setData: Dispatch<SetStateAction<InputData>>
}

export default function Input({
  type,
  label,
  className = "",
  required = false,
  data,
  setData,
}: Props) {
  const [focus, setFocus] = useState<boolean>(false)
  const [show, setShow] = useState<boolean>(false)

  useEffect(() => {
    if (data.validation.length > 0) setData({ ...data, validation: "" })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data.value, setData])

  return (
    <div className={`relative pt-4 mb-3 ${className}`}>
      <label
        htmlFor={label.replace(/\s+/g, "-")}
        className={`absolute font-semibold text-black capitalize transition-[all] duration-150 ease-out delay-100 ${
          focus || data.value.length > 0 ? "top-0 left-0" : "top-1/2 -translate-y-1/2 left-2"
        }`}
      >
        {label}
      </label>
      <input
        id={label.replace(/\s+/g, "-")}
        type={show ? "text" : type}
        className={`px-2 py-1.5 font-normal text-gray-500 border-b-2 border-black w-full`}
        onFocus={() => setFocus(true)}
        onBlur={() => setFocus(false)}
        value={data.value}
        onChange={(e) => setData({ ...data, value: e.target.value })}
        required={required}
      />
      {type === "password" && (
        <FontAwesomeIcon
          className="text-black absolute right-2 top-1/2 -translate-y-1/2"
          icon={show ? faEyeSlash : faEye}
          onClick={() => setShow(!show)}
        />
      )}
      {data.validation.length > 0 && (
        <span className="text-sm text-red-500 animate-shake first-letter:capitalize block ml-2 mt-1">
          {data.validation}
        </span>
      )}
    </div>
  )
}
