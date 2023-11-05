"use client"

import Input from "@/components/Input"
import { useToast } from "@/context/ToastContext"
import { AuthLoginResponseData, InputData } from "@/types"
import { faArrowRightToBracket, faCircleNotch } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import axios from "axios"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useRef, useState } from "react"

export default function Login() {
  const [loading, setLoading] = useState<boolean>(false)
  const formRef = useRef<HTMLFormElement>(null)
  const { pushToast } = useToast()
  const router = useRouter()
  const [email, setEmail] = useState<InputData>({ value: "", validation: "" })
  const [password, setPassword] = useState<InputData>({ value: "", validation: "" })

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()

    setLoading(true)

    setEmail({ ...email, validation: "" })
    setPassword({ ...password, validation: "" })

    await axios
      .post<AuthLoginResponseData>("/api/auth/login", {
        email: email.value,
        password: password.value,
      })
      .then((res) => {
        pushToast(res.data.message, "success")
        router.push("/app")
      })
      .catch((err) => {
        const errRes = err.response.data as AuthLoginResponseData

        if (errRes.error?.email) setEmail({ ...email, validation: errRes.error?.email })
        if (errRes.error?.password) setPassword({ ...password, validation: errRes.error?.password })
      })
      .finally(() => {
        setLoading(false)
      })
  }

  return (
    <form ref={formRef} onSubmit={submit} className="auth-card">
      <p className="header">welcome back!</p>
      <p className="description">Please enter your credentials</p>
      <Input type="email" label="email" data={email} setData={setEmail} required />
      <Input type="password" label="password" data={password} setData={setPassword} required />
      <Link href="/auth/forgot" className="text-sm hover:text-sky-400 transition-colors delay-100">
        Forgot password?
      </Link>
      <button
        type="submit"
        className="button w-full mt-2 font-semibold inline-flex gap-2 justify-center items-center"
        disabled={loading}
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
