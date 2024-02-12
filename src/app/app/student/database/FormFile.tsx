"use client"

import { faCircleCheck, faCloudArrowUp, faTrashCan } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { ChangeEvent, useCallback, useState } from "react"
import { useToast } from "@/context/ToastContext"
import Link from "next/link"

type FormProps = {
  id: string
  label: string
  file: string | null
}

export default function FormFile({ label, id, file }: FormProps) {
  const { pushToast } = useToast()
  const [link, setLink] = useState<string | null>(file)

  const clearFile = useCallback(() => {
    const element = document.getElementById(id)

    if (element instanceof HTMLInputElement) element.value = ""
  }, [id])

  const checkFile = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      if (e.target.files === null) return

      const file = e.target.files.item(0)

      if (file === null) return

      if (file.size > 2 * 1024 * 1024) {
        pushToast("Max size is 2MB", "danger")
        clearFile()
        return
      }

      if (!["image/jpeg", "image/png", "image/jpg", "application/pdf"].includes(file.type)) {
        pushToast("Invalid file type!", "danger")
        clearFile()
        return
      }

      setLink(URL.createObjectURL(file))
    },
    [pushToast, clearFile]
  )

  return (
    <div className="flex flex-col lg:flex-row gap-2 lg:gap-4 w-full">
      <label className="w-1/3 whitespace-nowrap inline-flex items-start">{label}</label>
      <div className="flex flex-col lg:flex-row gap-2 lg:gap-4 w-full bg-gray-50">
        <input
          type="file"
          id={id}
          name={id}
          className="hidden"
          required={file === null}
          accept=".jpg, .jpeg, .png, .pdf"
          onChange={checkFile}
        />
        <div className="w-full py-8 flex flex-col gap-2 justify-center items-center border rounded">
          <FontAwesomeIcon
            icon={link === null ? faCloudArrowUp : faCircleCheck}
            size="4x"
            className="text-neutral-300"
          />
          <p className="text-neutral-300">File format: JPG / JPEG / PNG</p>
          <label
            htmlFor={id}
            className={`px-4 py-2 rounded-md bg-sky-300 text-white mt-2 hover:cursor-pointer ${
              link === null ? "" : "hidden"
            }`}
          >
            Choose File
          </label>
          {link !== null ? (
            <div className="inline-flex gap-2 items-center my-2">
              <Link
                href={link}
                target="_blank"
                className="px-4 py-2 rounded-md bg-black text-white hover:cursor-pointer"
              >
                Open File
              </Link>
              <button
                className="inline-flex items-center gap-2 bg-red-100 text-red-400 px-4 py-2 rounded-md"
                onClick={() => {
                  clearFile()
                  setLink(null)
                }}
              >
                Remove
                <FontAwesomeIcon icon={faTrashCan} />
              </button>
            </div>
          ) : (
            ""
          )}
          <p className="text-neutral-300 text-sm">Max size: 2MB</p>
        </div>
      </div>
    </div>
  )
}
