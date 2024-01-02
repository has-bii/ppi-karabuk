"use client"

import getUserData, { UserData } from "@/utils/app/settings/getUserData"
import { useToast } from "@/context/ToastContext"
import { useEffect, useState } from "react"
import dummy from "@/images/dummy-pp.png"
import Image from "next/image"
import sendEmailVerification from "@/utils/app/settings/sendEmailVerification"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCircleNotch } from "@fortawesome/free-solid-svg-icons"
import updateUserData from "@/utils/app/settings/updateUserData"

export default function SettingsProfile() {
  const [data, setData] = useState<UserData | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [form, setForm] = useState<UserData | null>(null)
  const { pushToast } = useToast()

  useEffect(() => {
    getUserData()
      .then((res) => {
        if (res.status === "ok") {
          setData(res.data)
          setForm(res.data)
        } else pushToast("Failed to fetch data!", "error")
      })
      .catch((err) => {
        console.log("Error: ", err)
      })
      .finally(() => setLoading(false))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Send verification email
  function sendVerEmail(id: string, email: string) {
    pushToast("Sending verification email...", "normal")
    sendEmailVerification(id, email).then((res) => {
      pushToast(res.message, res.status)
    })
  }

  // Update Record
  function updateData() {
    if (form) {
      setLoading(true)
      updateUserData({
        id: form.id,
        name: form.name,
        email: form.email,
        kimlikID: form.kimlikId,
        studentID: form.studentId,
      })
        .then((res) => {
          pushToast(res.message, res.status)
        })
        .catch(() => {
          pushToast("Internal server error", "error")
        })
        .finally(() => setLoading(false))
    }
  }

  if (data && form) {
    return (
      <section className="w-full text-neutral-800 overflow-y-auto">
        <div className="flex flex-row gap-8 p-8 border rounded-lg items-center">
          {/* Image */}
          <div className="relative overflow-hidden rounded-md aspect-square h-44 bg-black">
            <Image
              src={data.img ? data.img : dummy}
              fill
              sizes="30vw"
              quality={100}
              priority
              alt=""
            />

            <div className="absolute w-full h-full top-0 left-0 bg-black z-10 opacity-0 hover:opacity-50 hover:cursor-pointer transition-opacity duration-150"></div>
          </div>

          {/* Profile */}
          <div className="flex flex-col gap-2">
            {/* Name */}
            <div>
              <span className="capitalize text-neutral-400">full name</span>
              <input
                type="text"
                className="block text-lg capitalize w-full"
                value={data.name}
                readOnly
              />
            </div>
            {/* Email */}
            <div>
              <span className="capitalize text-neutral-400">email address</span>
              <input type="text" className="block text-lg lowercase" value={data.email} readOnly />
            </div>
            {/* status */}
            <div>
              <span className="capitalize text-neutral-400">status</span>
              <div className="w-full inline-flex gap-4">
                {data.isVerified === null ? (
                  <>
                    <span className="text-lg capitalize">inactive</span>
                    <a
                      href="/app/settings?q=ACTIVATE"
                      className="bg-white px-2 py-1 border rounded-full text-sm hover:bg-black hover:text-white"
                    >
                      activate
                    </a>
                  </>
                ) : (
                  <span className="text-lg capitalize">active</span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Details */}
        <div className="border p-8 rounded-lg mt-8">
          <h6 className="text-xl text-neutral-800 font-semibold capitalize mb-4">details</h6>
          <div className="grid grid-cols-2 gap-x-8 gap-y-4">
            <div>
              <label htmlFor="name" className="capitalize text-neutral-400">
                full name
              </label>
              <input
                type="text"
                id="name"
                className="block text-lg capitalize w-full border rounded-md px-3 py-1.5 mt-1"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>
            <div>
              <label htmlFor="email" className="capitalize text-neutral-400 block">
                email address
              </label>
              <div className="inline-flex gap-2 w-full items-center">
                <input
                  type="text"
                  id="email"
                  className="block text-lg lowercase border rounded-md px-3 py-1.5 mt-1 w-full"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
                {form.emailVerified === null && (
                  <button
                    className="capitalize px-3 py-1.5 rounded-md bg-black text-white text-lg"
                    onClick={() => sendVerEmail(data.id, form.email)}
                    disabled={form.email !== data.email}
                  >
                    send
                  </button>
                )}
              </div>
              {form.emailVerified === null ? (
                <span className="pl-2 text-sm text-red-400">
                  Your email is not verified. Send the verification email.
                </span>
              ) : (
                ""
              )}
            </div>
            <div>
              <label htmlFor="studentid" className="capitalize text-neutral-400">
                Student ID
              </label>
              <input
                type="text"
                id="studentid"
                className="block text-lg lowercase border rounded-md px-3 py-1.5 mt-1 w-full"
                value={form.studentId}
                onChange={(e) => setForm({ ...form, studentId: e.target.value })}
              />
            </div>
            <div>
              <label htmlFor="kimlikid" className="capitalize text-neutral-400">
                Kimlik ID
              </label>
              <input
                type="text"
                id="kimlikid"
                className="block text-lg lowercase w-full border rounded-md px-3 py-1.5 mt-1"
                value={form.kimlikId}
                onChange={(e) => setForm({ ...form, kimlikId: e.target.value })}
              />
            </div>
            <div>
              <span className="capitalize text-neutral-400">role</span>
              <input
                type="text"
                className="block text-lg capitalize w-full"
                value={data.role.join(", ").toLowerCase()}
                readOnly
              />
            </div>
          </div>
        </div>

        <div className="w-full flex">
          <button
            className="px-4 py-2 bg-black rounded-md text-white ml-auto capitalize mt-4 disabled:bg-neutral-200 disabled:text-neutral-600 inline-flex gap-2 items-center"
            disabled={JSON.stringify(data) === JSON.stringify(form) || loading}
            onClick={updateData}
          >
            <span>save changes</span>
            {loading && <FontAwesomeIcon icon={faCircleNotch} className="animate-spin" />}
          </button>
        </div>
      </section>
    )
  }

  if (loading || data === null)
    return <section className="w-full bg-neutral-200 animate-pulse rounded-lg"></section>
}
