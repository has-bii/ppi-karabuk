import { TToastContext } from "@/types"
import { createContext, useContext } from "react"

export const ToastContext = createContext<TToastContext>({ pushToast: () => {} })

export const useToast = () => useContext(ToastContext)
