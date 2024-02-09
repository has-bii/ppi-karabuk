"use client"

import PageWrapper from "@/components/app/PageWrapper"
import navSideSettings from "../navSideSettings"
import { useRef } from "react"
import { useToast } from "@/context/ToastContext"
import deleteAccount from "@/service/App/settings/deleteAccount"
import { useRouter } from "next/navigation"

export default function Page() {
  const submitButtonRef = useRef<HTMLButtonElement>(null)
  const { pushToast } = useToast()
  const router = useRouter()

  async function submitHandler(formData: FormData) {
    const password = formData.get("password")

    if (!password) {
      pushToast("Password is required!", "danger")
      return
    }

    pushToast("Sending delete request...", "normal")

    const res = await deleteAccount(formData)

    pushToast(res.message, res.status)

    if (res.status === "success") router.push("/auth")
  }

  return (
    <PageWrapper url="/settings" navSideItems={navSideSettings}>
      <div className="rounded-lg p-4 lg:p-8 border">
        <p className="text-2xl text-red-400 font-semibold mb-2">Delete Account</p>
        <p className="text-neutral-400">Are you sure want to delete this account?</p>
        <form className="mt-2" action={submitHandler}>
          <label htmlFor="password">Password</label>
          <input
            type="password"
            name="password"
            id="password"
            className="block text-lg placeholder:text-neutral-200 px-3 py-1.5 border rounded-md"
            placeholder="Enter your password"
          />
          <button type="submit" className="hidden" ref={submitButtonRef}></button>
        </form>
      </div>
      <div className="w-full flex">
        <button
          className="ml-auto rounded-md bg-red-400 text-white px-3 py-1.5 mt-3"
          onClick={() => submitButtonRef.current?.click()}
        >
          Delete this account
        </button>
      </div>
    </PageWrapper>
  )
}
