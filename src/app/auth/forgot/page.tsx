"use client"

import Input from "@/components/Auth/Input"
import { useToast } from "@/context/ToastContext"
import { AuthForgotErrorResponse, AuthInput, AuthResponse } from "@/types/auth"
import { faArrowRightToBracket, faCircleNotch } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import axios from "axios"
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

  function checkEmailRegex(email: string) {
    const regex: RegExp = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g
    return regex.test(email)
  }

  async function submitHandler(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    setLoading(true)

    await axios
      .post<AuthResponse>("/api/auth/forgot", {
        email: email.value,
      })
      .then((res) => {
        if (res.data.status === "ok") {
          pushToast(res.data.message, "success")
        }
      })
      .catch(({ response }) => {
        const { data }: { data: AuthResponse<AuthForgotErrorResponse> } = response

        if (data.status === "error") {
          pushToast(data.message, "error")

          if (data.error.email)
            setEmail((prev) => ({
              ...prev,
              validation: { status: "error", text: data.message },
            }))
        }
      })
      .finally(() => {
        setLoading(false)
      })
  }

  useEffect(() => {
    if (email.value)
      if (checkEmailRegex(email.value)) {
        setEmail((prev) => ({ ...prev, validation: { status: "ok", text: "" } }))
      } else {
        setEmail((prev) => ({ ...prev, validation: { status: "error", text: "Invalid email!" } }))
      }
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
