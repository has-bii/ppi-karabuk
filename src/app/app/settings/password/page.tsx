"use client"

import SettingsPageWrapper from "@/components/app/settings/SettingsPageWrapper"
import PasswordInput from "@/components/app/settings/changePassword/PasswordInput"
import { useToast } from "@/context/ToastContext"
import ChangePassword from "@/service/App/settings/ChangePassword"
import { faCircleNotch } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useEffect, useRef, useState } from "react"

export default function Page() {
  const [loading, setLoading] = useState<boolean>(false)
  const [currentPass, setCurrentPass] = useState<string>("")
  const buttonRef = useRef<HTMLButtonElement>(null)
  const [pass2, setPass2] = useState<string>("")
  const [val2, setVal2] = useState<string>("")
  const [pass, setPass] = useState<string>("")
  const [val, setVal] = useState<string>("")
  const { pushToast } = useToast()

  useEffect(() => {
    if (pass.length === 0 || pass2.length === 0) return

    if (pass2.length > 0) {
      if (pass.length < 8) setVal("Password must contain at least 8 characters!")
      else setVal("")
    }

    if (pass !== pass2) setVal2("Confirm password doesn't match!")
    else setVal2("")
  }, [pass, pass2])

  async function submitHandler(formData: FormData) {
    const res = await ChangePassword(formData)
    pushToast(res.message, res.status)
    setLoading(false)
  }

  return (
    <SettingsPageWrapper>
      <section className="w-full text-neutral-800 overflow-y-auto scrollbar-thin scrollbar-track-rounded-lg scrollbar-thumb-rounded-md pb-8 lg:pb-0">
        <div className="border p-4 lg:p-8 rounded-lg">
          <h6 className="text-xl text-neutral-800 font-semibold capitalize mb-4">
            Change Password
          </h6>
          <form action={submitHandler} className="w-1/2 flex flex-col gap-4">
            <PasswordInput
              id="current-password"
              value={currentPass}
              setValue={setCurrentPass}
              label="current password"
            />
            <PasswordInput
              id="new-password"
              value={pass}
              setValue={setPass}
              label="new password"
              validation={val}
            />
            <PasswordInput
              id="confirm-password"
              value={pass2}
              setValue={setPass2}
              label="confirm password"
              validation={val2}
            />
            <button ref={buttonRef} type="submit" className="hidden"></button>
          </form>
        </div>

        {/* Save button */}
        <div className="w-full flex">
          <button
            className="px-4 py-2 bg-black rounded-md text-white ml-auto capitalize mt-4 disabled:bg-neutral-200 disabled:text-neutral-600 inline-flex gap-2 items-center"
            disabled={
              currentPass.length === 0 ||
              val.length > 0 ||
              val2.length > 0 ||
              pass.length === 0 ||
              pass2.length === 0
            }
            onClick={() => {
              setLoading(true)
              buttonRef.current?.click()
            }}
          >
            <span>save change</span>
            {loading && <FontAwesomeIcon icon={faCircleNotch} className="animate-spin" />}
          </button>
        </div>
      </section>
    </SettingsPageWrapper>
  )
}
