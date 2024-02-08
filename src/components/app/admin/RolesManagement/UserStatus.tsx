type Props = {
  isActive: boolean
}

export default function UserStatus({ isActive }: Props) {
  return (
    <div
      className={`inline-flex gap-1.5 px-2.5 py-1 rounded-full items-center capitalize text-sm ${
        isActive ? "bg-green-200 text-green-500" : "bg-red-200 text-red-500"
      }`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${isActive ? "bg-green-400" : "bg-red-400"}`}
      ></span>
      <span>{isActive ? "active" : "inactive"}</span>
    </div>
  )
}
