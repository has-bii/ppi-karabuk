/* eslint-disable react-hooks/exhaustive-deps */
"use client"

import Input from "@/components/Input"
import { useToast } from "@/context/ToastContext"
import { AuthRegisterResponseData, InputData } from "@/types"
import { faArrowRightToBracket, faCircleNotch } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import axios from "axios"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useRef, useState } from "react"

export default function Register() {
  const [loading, setLoading] = useState<boolean>(false)
  const formRef = useRef<HTMLFormElement>(null)
  const { pushToast } = useToast()
  const router = useRouter()
  const [name, setName] = useState<InputData>({ value: "", validation: "" })
  const [email, setEmail] = useState<InputData>({ value: "", validation: "" })
  const [studentId, setStudentId] = useState<InputData>({ value: "", validation: "" })
  const [kimlikId, setKimlikId] = useState<InputData>({ value: "", validation: "" })
  const [password, setPassword] = useState<InputData>({ value: "", validation: "" })
  const [repeatPassword, setRepeatPassword] = useState<InputData>({ value: "", validation: "" })

  useEffect(() => {
    const regex: RegExp = /^[a-zA-Z\s]+$/

    if (name.value)
      if (!regex.test(name.value))
        setName({ ...name, validation: "only contains alphabet and space!" })
  }, [name.value, setName])

  useEffect(() => {
    const regex: RegExp = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g

    if (email.value)
      if (!regex.test(email.value)) setEmail({ ...email, validation: "invalid email!" })
  }, [email.value, setEmail])

  useEffect(() => {
    const regex: RegExp = /^\d+$/

    if (studentId.value)
      if (!regex.test(studentId.value))
        setStudentId({ ...studentId, validation: "invalid Student ID!" })
  }, [studentId.value, setStudentId])

  useEffect(() => {
    const regex: RegExp = /^\d+$/

    if (kimlikId.value)
      if (!regex.test(kimlikId.value))
        setKimlikId({ ...kimlikId, validation: "invalid Kimlik ID!" })
  }, [kimlikId.value, setKimlikId])

  useEffect(() => {
    if (password.value)
      if (password.value.length < 8)
        setPassword({ ...password, validation: "at least password contains 8 characters" })
  }, [password.value, setPassword])

  useEffect(() => {
    if (repeatPassword.value)
      if (repeatPassword.value !== password.value)
        setRepeatPassword({ ...repeatPassword, validation: "Passwords did not match!" })
  }, [repeatPassword.value, password, setPassword])

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()

    if (
      name.validation ||
      email.validation ||
      studentId.validation ||
      kimlikId.validation ||
      password.validation ||
      repeatPassword.validation
    ) {
      return
    }

    setLoading(true)

    await axios
      .post<AuthRegisterResponseData>("/api/auth/register", {
        name: name.value,
        email: email.value,
        studentId: studentId.value,
        kimlikId: kimlikId.value,
        password: password.value,
      })
      .then((res) => {
        pushToast(res.data.message, "success")
        router.push("/auth")
      })
      .catch((err) => {
        const errRes = err.response.data as AuthRegisterResponseData

        if (errRes.error?.email) {
          setEmail({ ...email, validation: errRes.error.email })
          pushToast(errRes.error.email, "error")
        }
        if (errRes.error?.kimlikId) {
          setKimlikId({ ...kimlikId, validation: errRes.error.kimlikId })
          pushToast(errRes.error.kimlikId, "error")
        }
        if (errRes.error?.studentId) {
          setStudentId({ ...studentId, validation: errRes.error.studentId })
          pushToast(errRes.error.studentId, "error")
        }
      })
      .finally(() => {
        setLoading(false)
      })
  }

  return (
    <form ref={formRef} onSubmit={submit} className="auth-card">
      <p className="header">Register!</p>
      <Input type="text" label="full name" data={name} setData={setName} required />
      <Input type="email" label="email" data={email} setData={setEmail} required />
      <Input type="text" label="student ID" data={studentId} setData={setStudentId} required />
      <Input type="text" label="kimlik ID" data={kimlikId} setData={setKimlikId} required />
      <Input type="password" label="password" data={password} setData={setPassword} required />
      <Input
        type="password"
        label="repeat password"
        data={repeatPassword}
        setData={setRepeatPassword}
        required
      />
      <Link href="/auth/forgot" className="text-sm hover:text-sky-400 transition-colors delay-100">
        Forgot password?
      </Link>
      <button
        type="submit"
        className="button w-full mt-2 font-semibold inline-flex gap-2 justify-center items-center"
        disabled={
          loading ||
          name.validation.length > 0 ||
          email.validation.length > 0 ||
          studentId.validation.length > 0 ||
          kimlikId.validation.length > 0 ||
          password.validation.length > 0 ||
          repeatPassword.validation.length > 0
        }
      >
        <FontAwesomeIcon
          icon={loading ? faCircleNotch : faArrowRightToBracket}
          className={loading ? "animate-spin" : ""}
        />
        register
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
