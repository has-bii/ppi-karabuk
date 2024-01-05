import updateImageProfile from "@/service/App/settings/updateImageProfile"
import { ChangeEvent, Dispatch, SetStateAction, useRef, useState } from "react"
import { useToast } from "@/context/ToastContext"
import dummy from "@/images/dummy-pp.png"
import Image from "next/image"

type ChangingStateProps = {
  userImage: string | null
  setLocation: Dispatch<SetStateAction<"MENU" | "CHANGE" | "REMOVE">>
}

export default function ChangingState({ userImage, setLocation }: ChangingStateProps) {
  const [imageSrc, setImageSrc] = useState<string | null>(userImage)
  const [file, setFile] = useState<File | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const { pushToast } = useToast()

  function isImageFile(file: File): boolean {
    const acceptedImageTypes = ["image/jpeg", "image/png", "image/jpg"]
    return acceptedImageTypes.includes(file.type)
  }

  function uploadFileHandler(e: ChangeEvent<HTMLInputElement>) {
    if (e.target.files === null) {
      setImageSrc(userImage)
      setFile(null)
      return undefined
    }

    if (e.target.files.length === 0) {
      setImageSrc(userImage)
      setFile(null)
      return undefined
    }

    const file = e.target.files[0]

    if (file.size > 2 * 1024 * 1024) {
      pushToast("Max size is 5MB", "danger")
      setFile(null)
      setImageSrc(userImage)
      return undefined
    }

    if (isImageFile(file)) {
      const reader = new FileReader()
      reader.onload = (e: ProgressEvent<FileReader>) => {
        if (e.target?.result instanceof ArrayBuffer) {
          const blob = new Blob([e.target.result], { type: file.type })
          const objectUrl = URL.createObjectURL(blob)
          setImageSrc(objectUrl)
        }
      }

      reader.readAsArrayBuffer(file)
      setFile(file)
    } else {
      pushToast("Invalid file type!", "danger")
      setFile(null)
      setImageSrc(userImage)
    }
  }

  function updateHandler(file: File) {
    setLoading(true)
    const formData = new FormData()

    formData.append("image", file)

    updateImageProfile(formData)
      .then((res) => {
        pushToast(res.message, res.status)
        setTimeout(() => location.reload(), 3000)
      })
      .catch((err) => {
        console.error(err)
        pushToast("Internal server error!", "error")
      })
      .finally(() => setLoading(false))
  }

  return (
    <div className="flex flex-col gap-4 items-center">
      {/* Image */}
      <div className="relative overflow-hidden rounded-md aspect-square w-full bg-black">
        <Image
          src={imageSrc ? imageSrc : dummy}
          className="object-cover"
          fill
          sizes="30vw"
          quality={100}
          priority
          alt=""
        />
      </div>

      {/* Buttons */}
      <div className="inline-flex items-center gap-4 w-full">
        <div>
          <input
            ref={inputRef}
            type="file"
            name="file-image"
            id="file-image"
            accept="image/jpg,image/jpeg,image/png"
            onChange={uploadFileHandler}
            className="file:bg-black file:border-0 file:px-3 file:py-1.5 file:rounded-lg file:text-white file:mr-4 text-neutral-600 file:hover:cursor-pointer"
          />
          {file !== null ? (
            <button
              type="button"
              onClick={() => {
                updateHandler(file)
              }}
              disabled={loading}
              className="mt-2 w-full text-center capitalize rounded-md bg-sky-400 text-white font-medium px-3 py-1.5"
            >
              save
            </button>
          ) : (
            ""
          )}
          <button
            type="button"
            className="mt-2 w-full text-center capitalize rounded-md border text-sky-400 font-medium px-3 py-1.5"
            onClick={() => setLocation("MENU")}
          >
            back
          </button>
        </div>
      </div>
    </div>
  )
}
