/* eslint-disable react-hooks/exhaustive-deps */
"use client"

import Input from "@/components/Input"
import { useToast } from "@/context/ToastContext"
import { AuthForgotResponseData, InputData } from "@/types"
import { faArrowRightToBracket, faCircleNotch } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import axios from "axios"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

export default function Forgot() {
  const [email, setEmail] = useState<InputData>({ value: "", validation: "" })
  const [loading, setLoading] = useState<boolean>(false)
  const { pushToast } = useToast()
  const router = useRouter()

  useEffect(() => {
    const regex: RegExp = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g

    if (email.value)
      if (!regex.test(email.value)) setEmail({ ...email, validation: "invalid email!" })
  }, [email.value, setEmail])

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()

    if (email.validation) {
      return
    }

    setLoading(true)

    await axios
      .post<AuthForgotResponseData>("/api/auth/forgot", {
        email: email.value,
      })
      .then((res) => {
        pushToast(res.data.message, "success")
        router.push("/auth")
      })
      .catch((err) => {
        const errRes = err.response.data as AuthForgotResponseData

        if (errRes.error?.email) {
          setEmail({ ...email, validation: errRes.error.email })
          pushToast(errRes.error.email, "error")
        }
      })
      .finally(() => {
        setLoading(false)
      })
  }

  return (
    <form onSubmit={submit} className="auth-card">
      <p className="header">Forgot password?</p>
      <p className="description">No worries, we&apos;ll send you reset code.</p>
      <Input type="email" label="email" data={email} setData={setEmail} required />
      <button
        type="submit"
        className="button w-full mt-2 font-semibold inline-flex gap-2 justify-center items-center"
        disabled={loading || email.validation.length > 0}
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
