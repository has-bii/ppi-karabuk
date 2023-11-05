"use client"

import Toast from "@/components/Toast"
import { ToastContext } from "@/context/ToastContext"
import { ToastData, ToastStatus } from "@/types"
import { ReactNode, useEffect, useState } from "react"

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastData[]>([])
  const [to, setTo] = useState<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (toasts.length > 0) {
      if (to) {
        clearTimeout(to)
        setTo(null)
      }

      setTo(setTimeout(() => setToasts(toasts.slice(1, toasts.length)), 2000))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [toasts])

  function pushToast(message: string, status: ToastStatus) {
    setToasts((prev) => [...prev, { message, status }])
  }

  function delToast(toast: ToastData) {
    setToasts(toasts.filter((item) => JSON.stringify(item) !== JSON.stringify(toast)))
  }

  return (
    <ToastContext.Provider value={{ pushToast }}>
      {toasts.length !== 0 && <Toast toasts={toasts} delToast={delToast} />}
      {children}
    </ToastContext.Provider>
  )
}
