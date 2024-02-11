"use client"

import { faArrowRightFromBracket, faCircleNotch } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useFormStatus } from "react-dom"

export default function SubmitButton() {
  const { pending } = useFormStatus()

  return (
    <div className="w-full flex">
      <button className="lg:w-fit w-full lg:ml-auto px-4 py-2 rounded-md bg-black text-white inline-flex gap-2 items-center justify-center">
        {pending ? "Submitting..." : "Submit Data"}

        <FontAwesomeIcon
          icon={pending ? faCircleNotch : faArrowRightFromBracket}
          className={pending ? "animate-spin" : ""}
        />
      </button>
    </div>
  )
}
