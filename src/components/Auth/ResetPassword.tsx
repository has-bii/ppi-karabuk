"use client"

import { FormEvent, useEffect, useState } from "react"
import Input from "./Input"
import { useToast } from "@/context/ToastContext"
import { AuthInput, AuthResetErrorResponse, AuthResponse } from "@/types/auth"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faArrowRightToBracket, faCircleNotch } from "@fortawesome/free-solid-svg-icons"
import axios from "axios"
import { useRouter } from "next/navigation"

export default function ResetPassword({ token }: { token: string }) {
  const [loading, setLoading] = useState<boolean>(false)
  const router = useRouter()
  const { pushToast } = useToast()
  const [password, setPassword] = useState<AuthInput>({
    label: "password",
    value: "",
    validation: { status: null, text: "" },
  })
  const [confirm, setConfirm] = useState<AuthInput>({
    label: "confirm",
    value: "",
    validation: { status: null, text: "" },
  })

  async function submitHandler(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    setLoading(true)

    await axios
      .post<AuthResponse>("/api/auth/reset", {
        password: password.value,
        token: token,
      })
      .then((res) => {
        if (res.data.status === "ok") {
          pushToast(res.data.message, "success")
          router.push("/auth")
        }
      })
      .catch(({ response }) => {
        const { data }: { data: AuthResponse<AuthResetErrorResponse> } = response

        if (data.status === "error") {
          pushToast(data.message, "error")
        }
      })
      .finally(() => {
        setLoading(false)
      })
  }

  useEffect(() => {
    if (password.value.length < 8) {
      setPassword((prev) => ({
        ...prev,
        validation: { status: "error", text: "at least password contains 8 characters" },
      }))
    } else
      setPassword((prev) => ({
        ...prev,
        validation: { status: "ok", text: "" },
      }))
  }, [password.value])

  useEffect(() => {
    if (confirm.value.length)
      if (confirm.value !== password.value) {
        setConfirm((prev) => ({
          ...prev,
          validation: { status: "error", text: "Passwords did not match!" },
        }))
      } else
        setConfirm((prev) => ({
          ...prev,
          validation: { status: "ok", text: "" },
        }))
  }, [confirm.value, password.value])

  return (
    <form onSubmit={submitHandler} className="auth-card">
      <p className="header">Forgot password?</p>
      <p className="description mb-4">No worries, we&apos;ll send you reset code.</p>
      <Input state={password} type="password" setState={setPassword} required />
      <Input state={confirm} type="password" setState={setConfirm} required />
      <button
        type="submit"
        className="button w-full mt-2 font-semibold inline-flex gap-2 justify-center items-center"
        disabled={
          loading || password.validation.status === "error" || confirm.validation.status === "error"
        }
      >
        <FontAwesomeIcon
          icon={loading ? faCircleNotch : faArrowRightToBracket}
          className={loading ? "animate-spin" : ""}
        />
        change password
      </button>
    </form>
  )
}
