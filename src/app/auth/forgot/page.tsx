"use client"

import Input from "@/components/Auth/Input"
import { useToast } from "@/context/ToastContext"
import { AuthInput } from "@/types/auth"
import forgot from "@/service/auth/forgot"
import { faArrowRightToBracket, faCircleNotch } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import Link from "next/link"
import { FormEvent, useEffect, useState } from "react"

export default function Forgot() {
  const [loading, setLoading] = useState<boolean>(false)
  const { pushToast } = useToast()

  const [email, setEmail] = useState<AuthInput>({
    label: "email",
    value: "",
    validation: { status: null, text: "" },
  })

  async function submitHandler(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    setLoading(true)

    const res = await forgot({ email: email.value })

    pushToast(res.message, res.status)

    if (res.status === "error")
      setEmail({ ...email, validation: { status: "error", text: res.message } })

    setLoading(false)
  }

  useEffect(() => {
    if (email.validation.status === "error")
      setEmail({ ...email, validation: { status: null, text: "" } })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [email.value])

  return (
    <form onSubmit={submitHandler} className="auth-card">
      <p className="header">Forgot password?</p>
      <p className="description mb-4">No worries, we&apos;ll send you reset code.</p>
      <Input state={email} type="email" setState={setEmail} required />
      <button
        type="submit"
        className="button w-full mt-2 font-semibold inline-flex gap-2 justify-center items-center"
        disabled={loading || email.validation.status === "error"}
      >
        <FontAwesomeIcon
          icon={loading ? faCircleNotch : faArrowRightToBracket}
          className={loading ? "animate-spin" : ""}
        />
        reset password
      </button>

      <p className="text-sm text-center text-slate-600 mt-2">
        Already have an account?&nbsp;
        <Link href="/auth" className="text-sky-500">
          Login
        </Link>
      </p>
    </form>
  )
}
