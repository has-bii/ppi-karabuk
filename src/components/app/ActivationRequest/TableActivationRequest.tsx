"use client"

import { ActivationRequestStatus } from "@prisma/client"
import { useState } from "react"
import RenderStatus from "./RenderStatus"
import getFileServiceURL from "@/utils/getFileServiceURL"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCircleCheck, faCircleXmark } from "@fortawesome/free-solid-svg-icons"
import { useToast } from "@/context/ToastContext"
import { VerifyParams } from "@/types/activationrequest"
import { Response } from "@/types/response"

type Props = {
  DATA: {
    id: bigint
    userId: string
    file: string
    status: ActivationRequestStatus
    createdAt: Date
    user: { name: string }
  }[]
  updateStatus({ requestId, userId, status }: VerifyParams): Promise<Response>
}

export default function TableActivationRequest({ DATA, updateStatus }: Props) {
  const [data, setData] = useState<Props["DATA"]>(DATA)
  const { pushToast } = useToast()

  async function verifyHandler(userId: string, requestId: bigint, status: ActivationRequestStatus) {
    try {
      pushToast("Sending a request...", "normal")

      const res = await updateStatus({ requestId, userId, status })

      pushToast(res.message, res.status)

      if (res.status === "success")
        setData(
          data.map((item) => {
            if (item.id === requestId) item.status = status

            return item
          })
        )
    } catch (error) {
      pushToast("Internal server error!", "error")
    }
  }

  return (
    <div className="table rounded-lg border overflow-hidden">
      <table>
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">Name</th>
            <th scope="col">Status</th>
            <th scope="col">File</th>
            <th scope="col">Submit Time</th>
            <th scope="col"></th>
          </tr>
        </thead>
        <tbody>
          {data.length > 0 ? (
            data.map((item, index) => (
              <tr key={item.id} className="bg-white border-b">
                <td scope="row" className="">
                  {(index + 1).toString()}
                </td>
                <td className="whitespace-nowrap capitalize">{item.user.name}</td>
                <td>
                  <RenderStatus status={item.status} />
                </td>
                <td>
                  <button
                    className="bg-black px-2 py-1 rounded-md text-white whitespace-nowrap"
                    onClick={() => {
                      window.open(getFileServiceURL(item.file), "_blank")
                    }}
                  >
                    Open file
                  </button>
                </td>
                <td className="whitespace-nowrap">{item.createdAt.toLocaleString()}</td>
                <td className="gap-2 inline-flex">
                  <button
                    className="inline-flex gap-1 items-center bg-green-400 px-2 py-1 text-white rounded-md"
                    onClick={() => verifyHandler(item.userId, item.id, "APPROVED")}
                  >
                    Verify
                    <FontAwesomeIcon icon={faCircleCheck} />
                  </button>
                  <button
                    className="inline-flex gap-1 items-center bg-red-400 px-2 py-1 text-white rounded-md"
                    onClick={() => verifyHandler(item.userId, item.id, "REJECTED")}
                  >
                    Reject
                    <FontAwesomeIcon icon={faCircleXmark} />
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr className="text-center">
              <td colSpan={5}>There is no data</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}
