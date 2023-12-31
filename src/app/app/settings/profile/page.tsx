"use client"

import getUserData, { UserData } from "@/service/App/settings/getUserData"
import { useToast } from "@/context/ToastContext"
import { useEffect, useState } from "react"
import dummy from "@/images/dummy-pp.png"
import Image from "next/image"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCircleNotch, faImage } from "@fortawesome/free-solid-svg-icons"
import sendEmailVerification from "@/service/App/settings/sendEmailVerification"
import updateUserData from "@/service/App/settings/updateUserData"
import SettingsPageWrapper from "@/components/app/settings/SettingsPageWrapper"
import ChangeImage from "@/components/app/settings/ChangeImage/ChangeImage"

export default function Profile() {
  const [data, setData] = useState<UserData | null>(null)
  const [form, setForm] = useState<UserData | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [updateLoading, setUpdateLoading] = useState<boolean>(false)
  const [modal, setModal] = useState<boolean>(false)
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
      setUpdateLoading(true)
      updateUserData({
        id: form.id,
        name: form.name,
        email: form.email,
        kimlikID: form.kimlikId,
        studentID: form.studentId,
      })
        .then((res) => {
          pushToast(res.message, res.status)

          if (res.status === "success") setData(form)
        })
        .catch(() => {
          pushToast("Internal server error", "error")
        })
        .finally(() => setUpdateLoading(false))
    }
  }

  if (loading || data === null || form === null)
    return (
      <SettingsPageWrapper>
        <section className="w-full bg-neutral-200 animate-pulse rounded-lg h-[48rem]"></section>
      </SettingsPageWrapper>
    )

  return (
    <>
      <ChangeImage userImage={data.img} modal={modal} setModal={setModal} />

      <SettingsPageWrapper>
        <section className="w-full text-neutral-800 overflow-y-auto scrollbar-thin scrollbar-track-rounded-lg scrollbar-thumb-rounded-md pb-8 lg:pb-0">
          <div className="flex flex-col-reverse lg:flex-row gap-4 lg:gap-8 p-4 lg:p-8 border rounded-lg">
            {/* Image */}
            <div className="flex flex-col w-full lg:w-fit gap-2 items-center">
              <div className="relative overflow-hidden rounded-md aspect-square w-full lg:w-48 bg-black">
                <Image
                  src={
                    data.img
                      ? `${
                          process.env.NODE_ENV === "production"
                            ? (process.env.NEXT_PUBLIC_IMG_PROVIDER_URL as string) + data.img
                            : data.img
                        }`
                      : dummy
                  }
                  fill
                  className="object-cover"
                  sizes="30vw"
                  quality={100}
                  priority
                  alt=""
                />
              </div>
              <button
                className="inline-flex items-center gap-2 text-sky-400 w-fit capitalize"
                onClick={() => setModal(true)}
              >
                <FontAwesomeIcon icon={faImage} size="lg" />
                change image
              </button>
            </div>

            {/* Profile */}
            <div className="flex flex-col gap-2 w-full">
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
                <input
                  type="text"
                  className="block text-lg lowercase w-full"
                  value={data.email}
                  readOnly
                />
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
              {/* Roles */}
              <div>
                <span className="capitalize text-neutral-400">role</span>
                <input
                  type="text"
                  className="block text-lg capitalize"
                  value={data.role.join(", ").toLowerCase()}
                  readOnly
                />
              </div>
            </div>
          </div>

          {/* Details */}
          <div className="border p-4 lg:p-8 rounded-lg mt-4 lg:mt-8">
            <h6 className="text-xl text-neutral-800 font-semibold capitalize mb-4">details</h6>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-8 gap-y-4">
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
                  <div className="pl-2 text-sm text-red-400 truncate">
                    Your email is not verified. Send the verification email.
                  </div>
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
            </div>
          </div>

          {/* Save button */}
          <div className="w-full flex">
            <button
              className="px-4 py-2 bg-black rounded-md text-white ml-auto capitalize mt-4 disabled:bg-neutral-200 disabled:text-neutral-600 inline-flex gap-2 items-center"
              disabled={JSON.stringify(data) === JSON.stringify(form) || updateLoading}
              onClick={updateData}
            >
              <span>save changes</span>
              {updateLoading && <FontAwesomeIcon icon={faCircleNotch} className="animate-spin" />}
            </button>
          </div>
        </section>
      </SettingsPageWrapper>
    </>
  )
}
