"use client"

import Input from "@/components/Auth/Input"
import { useToast } from "@/context/ToastContext"
import { AuthInput, AuthRegisterErrorResponse, AuthResponse } from "@/types/auth"
import checkEmail from "@/utils/auth/checkEmail"
import checkKimlik from "@/utils/auth/checkKimlik"
import checkStudentID from "@/utils/auth/checkStudentID"
import { faArrowRightToBracket, faCircleNotch } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import axios from "axios"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { FormEvent, useEffect, useState } from "react"

export default function Register() {
  const router = useRouter()
  const { pushToast } = useToast()
  const [loading, setLoading] = useState<boolean>(false)
  const [step, setStep] = useState<number>(1)
  const [name, setName] = useState<AuthInput>({
    label: "name",
    value: "",
    validation: { status: null, text: "" },
  })
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
  const [password2, setPassword2] = useState<AuthInput>({
    label: "confirm",
    value: "",
    validation: { status: null, text: "" },
  })
  const [studentID, setStudentID] = useState<AuthInput>({
    label: "Student ID",
    value: "",
    validation: { status: null, text: "" },
  })
  const [kimlikID, setKimlikID] = useState<AuthInput>({
    label: "Kimlik ID",
    value: "",
    validation: { status: null, text: "" },
  })

  async function submitHandler(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!checkStep(step, 3)) {
      setStep(step + 1)
      return
    }

    setLoading(true)

    await axios
      .post<AuthResponse>("/api/auth/register", {
        name: name.value,
        email: email.value,
        studentId: studentID.value,
        kimlikId: kimlikID.value,
        password: password.value,
      })
      .then((res) => {
        if (res.data.status === "ok") {
          pushToast(res.data.message, "success")
          router.push("/app")
        }
      })
      .catch(({ response }) => {
        const { data }: { data: AuthResponse<AuthRegisterErrorResponse> } = response

        if (data.status === "error") {
          pushToast(data.message, "error")

          if (data.error.kimlikID)
            setKimlikID((prev) => ({
              ...prev,
              validation: { status: "error", text: data.error.kimlikID || "" },
            }))

          if (data.error.studentID)
            setStudentID((prev) => ({
              ...prev,
              validation: { status: "error", text: data.error.kimlikID || "" },
            }))
        }
      })
      .finally(() => {
        setLoading(false)
      })
  }

  function checkStep(step: number, n: number): boolean {
    // if (step === n) return "block"

    return step === n
  }

  function checkEmailRegex(email: string) {
    const regex: RegExp = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g
    return regex.test(email)
  }

  function checkNameRegex(name: string) {
    const regex: RegExp = /^[a-zA-Z\s]+$/

    return regex.test(name)
  }

  useEffect(() => {
    if (studentID.value.length >= 10)
      checkStudentID(studentID.value).then((res: AuthResponse) => {
        setStudentID((prev) => ({ ...prev, validation: { status: res.status, text: res.message } }))
      })
  }, [studentID.value])

  useEffect(() => {
    if (kimlikID.value.length >= 11)
      checkKimlik(kimlikID.value).then((res: AuthResponse) => {
        setKimlikID((prev) => ({ ...prev, validation: { status: res.status, text: res.message } }))
      })
  }, [kimlikID.value])

  useEffect(() => {
    if (email.value)
      if (checkEmailRegex(email.value)) {
        setEmail((prev) => ({ ...prev, validation: { status: null, text: "" } }))
        checkEmail(email.value).then((res: AuthResponse) => {
          setEmail((prev) => ({ ...prev, validation: { status: res.status, text: res.message } }))
        })
      } else {
        setEmail((prev) => ({ ...prev, validation: { status: "error", text: "Invalid email!" } }))
      }
  }, [email.value])

  useEffect(() => {
    if (name.value.length >= 6)
      if (checkNameRegex(name.value)) {
        setName((prev) => ({ ...prev, validation: { status: "ok", text: "Name is available" } }))
      } else {
        setName((prev) => ({
          ...prev,
          validation: { status: "error", text: "Only alphabets are allowed!" },
        }))
      }
    else
      setName((prev) => ({ ...prev, validation: { status: "error", text: "Min 6 characters!" } }))
  }, [name.value])

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
    if (password2.value)
      if (password2.value !== password.value) {
        setPassword2((prev) => ({
          ...prev,
          validation: { status: "error", text: "Passwords did not match!" },
        }))
      } else
        setPassword2((prev) => ({
          ...prev,
          validation: { status: "ok", text: "" },
        }))
  }, [password2.value, password])

  const buttonHandler = (): boolean => {
    if (step === 1)
      return studentID.validation.status !== "ok" || kimlikID.validation.status !== "ok"

    if (step === 2) return name.validation.status !== "ok" || email.validation.status !== "ok"

    return password.validation.status !== "ok" || password2.validation.status !== "ok"
  }

  return (
    <form onSubmit={submitHandler} className="auth-card">
      <p className="header pb-4">Register!</p>

      {checkStep(step, 1) ? (
        <>
          <Input state={studentID} type="text" setState={setStudentID} required />
          <Input state={kimlikID} type="text" setState={setKimlikID} required />
        </>
      ) : checkStep(step, 2) ? (
        <>
          <Input state={name} type="text" setState={setName} required />
          <Input state={email} type="email" setState={setEmail} required />
        </>
      ) : (
        <>
          <Input state={password} type="password" setState={setPassword} required />
          <Input state={password2} type="password" setState={setPassword2} required />
        </>
      )}

      <Link href="/auth/forgot" className="text-sm hover:text-sky-400 transition-colors delay-100">
        Forgot password?
      </Link>
      <button
        type="submit"
        className="button w-full mt-2 font-semibold inline-flex gap-2 justify-center items-center"
        disabled={loading || buttonHandler()}
      >
        <FontAwesomeIcon
          icon={loading ? faCircleNotch : faArrowRightToBracket}
          className={loading ? "animate-spin" : ""}
        />
        {checkStep(step, 3) ? "Register" : "Next"}
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
