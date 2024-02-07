"use client"

import { ReactNode, useCallback, useEffect, useState } from "react"
import { ToastData, ToastStatus } from "@/types/toast"
import { ToastContext } from "@/context/ToastContext"
import Toast from "@/components/Toast"
import { v1 as uuidv1 } from "uuid"

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastData[]>([])
  const [to, setTo] = useState<NodeJS.Timeout | null>(null)

  const changeHandler = useCallback(() => {
    if (toasts.length > 0) {
      if (to) {
        clearTimeout(0)
        setTo(null)
      }

      setTo(setTimeout(() => setToasts(toasts.slice(1, toasts.length)), 2000))
    }
  }, [to, toasts])

  useEffect(() => {
    changeHandler()
  }, [toasts, changeHandler])

  function pushToast(message: string, status: ToastStatus) {
    setToasts((prev) => [...prev, { message, status, id: uuidv1() }])
  }

  function delToast(toast: ToastData) {
    setToasts(toasts.filter((item) => item.id !== toast.id))
  }

  return (
    <ToastContext.Provider value={{ pushToast }}>
      {toasts.length !== 0 && <Toast toasts={toasts} delToast={delToast} />}
      {children}
    </ToastContext.Provider>
  )
}
