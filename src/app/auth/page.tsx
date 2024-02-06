"use client"

import Input from "@/components/Auth/Input"
import { useToast } from "@/context/ToastContext"
import { AuthInput } from "@/types/auth"
import login from "@/service/auth/login"
import { faArrowRightToBracket, faCircleNotch } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { FormEvent, useState } from "react"

export default function Login() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { pushToast } = useToast()
  const [loading, setLoading] = useState<boolean>(false)
  const [email, setEmail] = useState<AuthInput>({
    label: "email",
    value: "",
    validation: { status: null, text: "" },
  })
  const [password, setPassword] = useState<AuthInput>({
    label: "password",
    value: "",
    validation: { status: null, text: "" },
  })

  const submitHandler = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    setLoading(true)

    login({ email: email.value, password: password.value })
      .then((res) => {
        if (res.status === "success") {
          pushToast(res.message, "success")
          const callbackUrl = searchParams.get("callbackUrl")

          if (callbackUrl) router.replace(callbackUrl)
          else router.push("/app")
        }

        if (res.status === "error") {
          if (res.error.email)
            setEmail((prev) => ({
              ...prev,
              validation: { status: "error", text: res.error.email as string },
            }))

          if (res.error.password)
            setPassword((prev) => ({
              ...prev,
              validation: { status: "error", text: res.error.password as string },
            }))

          pushToast(res.message, "error")
        }
      })
      .catch((err) => {
        pushToast("Internal server error", "danger")
      })
      .finally(() => {
        setLoading(false)
      })
  }

  const isEmpty = (email: string, password: string) => {
    return email.length === 0 || password.length === 0
  }

  return (
    <form onSubmit={submitHandler} className="auth-card">
      <p className="header">welcome back!</p>
      <p className="description mb-4">Please enter your credentials</p>

      <Input state={email} type="email" setState={setEmail} required />

      <Input state={password} setState={setPassword} type="password" required />

      <Link href="/auth/forgot" className="text-sm hover:text-sky-400 transition-colors delay-100">
        Forgot password?
      </Link>
      <button
        type="submit"
        className="button disabled:hover:cursor-not-allowed w-full mt-2 font-semibold inline-flex gap-2 justify-center items-center"
        disabled={loading || isEmpty(email.value, password.value)}
      >
        <FontAwesomeIcon
          icon={loading ? faCircleNotch : faArrowRightToBracket}
          className={loading ? "animate-spin" : ""}
        />
        login
      </button>

      <p className="text-sm text-center text-slate-600 mt-2">
        Don&apos;t have an account?&nbsp;
        <Link href="/auth/register" className="text-sky-500">
          Register
        </Link>
      </p>
    </form>
  )
}
