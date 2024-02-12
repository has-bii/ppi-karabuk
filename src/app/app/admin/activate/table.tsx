"use client"

import { ActivationRequestStatus } from "@prisma/client"
import { useCallback, useState } from "react"
import getFileServiceURL from "@/utils/getFileServiceURL"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCircleCheck, faCircleXmark } from "@fortawesome/free-solid-svg-icons"
import { useToast } from "@/context/ToastContext"
import { VerifyParams } from "@/types/activationrequest"
import { Response } from "@/types/response"
import SearchByName from "@/components/app/table/searchByName"
import TableComponent from "@/components/app/table/Table"
import RenderStatus from "@/components/app/RenderStatus"

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

export default function Table({ DATA, updateStatus }: Props) {
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

  const filterByName = useCallback(
    (name: string) => {
      setData(DATA.filter((item) => item.user.name.includes(name)))
    },
    [DATA]
  )

  return (
    <>
      <SearchByName dataProp={DATA} setData={setData} func={filterByName} />
      <TableComponent columns={["name", "status", "file", "submit time", ""]} dataProp={data}>
        {data.length > 0 ? (
          data.map((item) => (
            <tr key={item.id}>
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
      </TableComponent>
    </>
  )
}
