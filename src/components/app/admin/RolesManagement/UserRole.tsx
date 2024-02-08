import { $Enums, Role } from "@prisma/client"
import React, { useCallback } from "react"

type Props = {
  role: $Enums.Role[]
}

export default function UserRole({ role }: Props) {
  return (
    <div className="inline-flex gap-1 items-center">
      {role.map((item, index) => (
        <RenderRole key={index} role={item} />
      ))}
    </div>
  )
}

function RenderRole({ role }: { role: Role }) {
  const getStyle = useCallback((role: Role): string => {
    if (role === "ADMIN") return "bg-blue-200 text-blue-500"

    if (role === "USER") return "bg-neutral-200 text-neutral-500"

    if (role === "STUDENT") return "bg-green-200 text-green-500"

    return ""
  }, [])

  return (
    <div className={`capitalize px-2.5 py-1 rounded-full text-sm ${getStyle(role)}`}>
      {role.toLowerCase()}
    </div>
  )
}
