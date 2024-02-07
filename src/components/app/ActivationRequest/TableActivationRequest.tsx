"use client"

import { ActivationRequestStatus } from "@prisma/client"
import { useCallback, useEffect, useState } from "react"
import RenderStatus from "./RenderStatus"
import getFileServiceURL from "@/utils/getFileServiceURL"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faAngleLeft,
  faAngleRight,
  faCircleCheck,
  faCircleXmark,
} from "@fortawesome/free-solid-svg-icons"
import { useToast } from "@/context/ToastContext"
import { VerifyParams } from "@/types/activationrequest"
import { Response } from "@/types/response"
import { Pagination } from "@/types/table"

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
  const [pagination, setPagination] = useState<Pagination>({ start: 0, end: 10, row: 10 })
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

  function prevPagination() {
    const check = pagination.start - pagination.row < 0

    setPagination((prev) => ({
      ...prev,
      start: check ? 0 : prev.start - prev.row,
      end: check ? prev.row : prev.end - prev.row,
    }))
  }

  function nextPagination() {
    setPagination((prev) => ({ ...prev, start: prev.start + prev.row, end: prev.end + prev.row }))
  }

  const checkPagination = useCallback((): number => {
    if (pagination.end > data.length) return data.length

    return pagination.end
  }, [pagination.end, data.length])

  const checkNext = useCallback((): boolean => {
    return pagination.end >= data.length
  }, [pagination.end, data.length])

  const checkPrev = useCallback((): boolean => {
    return pagination.start === 0
  }, [pagination.start])

  useEffect(() => {
    setPagination((prev) => ({ ...prev, start: prev.start, end: prev.start + prev.row }))
  }, [pagination.row])

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
            data.slice(pagination.start, pagination.end).map((item, index) => (
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
              <td colSpan={6}>There is no data</td>
            </tr>
          )}

          <tr>
            <td colSpan={6}>
              <div className="w-full flex items-center justify-between">
                <div>
                  <span className="whitespace-nowrap">Show rows per page</span>
                  <select
                    className="border rounded-md ml-2 p-1"
                    onChange={(e) =>
                      setPagination((prev) => ({ ...prev, row: parseInt(e.target.value) }))
                    }
                    defaultValue={pagination.row}
                  >
                    <option value="5">5</option>
                    <option value="10">10</option>
                    <option value="20">20</option>
                    <option value="25">25</option>
                  </select>
                </div>

                {/* Pagination */}
                <div className="inline-flex gap-6">
                  <div className="text-neutral-400">
                    <span className="text-neutral-700 font-semibold">{`${
                      pagination.start + 1
                    }-${checkPagination()}`}</span>
                    {` of ${data.length}`}
                  </div>
                  <button
                    className="text-neutral-700 disabled:text-neutral-400"
                    onClick={() => prevPagination()}
                    disabled={checkPrev()}
                  >
                    <FontAwesomeIcon icon={faAngleLeft} />
                  </button>
                  <button
                    className="text-neutral-700 disabled:text-neutral-400"
                    onClick={() => nextPagination()}
                    disabled={checkNext()}
                  >
                    <FontAwesomeIcon icon={faAngleRight} />
                  </button>
                </div>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}
