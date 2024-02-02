/* eslint-disable react-hooks/exhaustive-deps */
"use client"

import SettingsPageWrapper from "@/components/app/settings/SettingsPageWrapper"
import { useToast } from "@/context/ToastContext"
import activationRequest from "@/service/App/settings/ActivationRequest/activationRequest"
import { faCircleNotch, faFileArrowUp, faTrashCan } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { ChangeEvent, useCallback, useEffect, useRef, useState } from "react"
import { $Enums } from "@prisma/client"
import getData from "../../../../service/App/settings/ActivationRequest/getData"
import deleteRequest from "@/service/App/settings/ActivationRequest/deleteRequest"
import Modal from "@/components/Modal"

type Data = {
  id: bigint
  img: string
  createdAt: Date
  status: $Enums.ActivationRequestStatus
}[]

export default function Page() {
  const [file, setFile] = useState<{ file: File; src: string } | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [modal, setModal] = useState<boolean>(false)
  const [previewSrc, setPreviewSrc] = useState<string | null>(null)
  const buttonRef = useRef<HTMLInputElement>(null)
  const [data, setData] = useState<Data>([])
  const { pushToast } = useToast()

  function uploadFileHandler(e: ChangeEvent<HTMLInputElement>) {
    if (e.target.files?.item(0) === null || e.target.files === null) {
      return
    }

    const file = e.target.files.item(0) as File

    if (file.size > 2 * 1024 * 1024) {
      pushToast("Max size is 2MB", "danger")
      setFile(null)
      return
    }

    if (!["image/jpeg", "image/png", "image/jpg", "application/pdf"].includes(file.type)) {
      pushToast("Invalid file type!", "danger")
      setFile(null)
      return
    }

    setFile({
      file: file,
      src: URL.createObjectURL(file),
    })
  }

  async function submitHandler() {
    if (!file) return
    setLoading(true)

    try {
      const formData = new FormData()
      formData.append("file-input", file.file)

      const res = await activationRequest(formData)

      pushToast(res.message, res.status)
      setFile(null)
      fetchData()
    } catch (error) {
      pushToast("An error has occurred!", "error")
    }

    setLoading(false)
  }

  async function deleteData(id: bigint) {
    try {
      const res = await deleteRequest(id)

      if (res.status === "success") setData(data.filter((item) => item.id !== id))

      pushToast(res.message, res.status)
    } catch (error) {
      pushToast("An error has occurred!", "error")
    }
  }

  const fetchData = useCallback(async () => {
    try {
      setLoading(true)
      const res = await getData()

      setData(res)
    } catch (error) {
      pushToast("An error has occurred!", "error")
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    fetchData()
  }, [])

  function closePreview() {
    setPreviewSrc(null)
  }

  return (
    <>
      <Modal
        title="Preview File"
        show={modal && previewSrc !== null}
        setShow={setModal}
        className="w-full"
        closeFunction={closePreview}
      >
        <div className="w-full h-[50rem]">
          <iframe
            width="100%"
            height="100%"
            src={
              process.env.NODE_ENV === "production"
                ? `${process.env.NEXT_PUBLIC_IMG_PROVIDER_URL}/${previewSrc}`
                : (previewSrc as string)
            }
          ></iframe>
        </div>
        <div className="w-full">b</div>
      </Modal>

      <SettingsPageWrapper>
        <section className="w-full text-neutral-800 overflow-y-auto scrollbar-thin scrollbar-track-rounded-lg scrollbar-thumb-rounded-md pb-8 lg:pb-0">
          <div className="border p-4 lg:p-8 rounded-lg">
            {/* Upload section */}
            <div className="flex flex-col lg:flex-row gap-8 lg:gap-4 mb-8">
              <div className="lg:w-1/2 text-neutral-400">
                <p className="text-justify">
                  Aktivasi akun diperlukan untuk menunjukkan status Mahasiswa Aktif di Karabuk
                  University. Dan wajib melakukan aktivasi 6 bulan sekali atau di awal semester.
                  Untuk ketentuan-ketentuannya adalah:
                </p>
                <ul className="list-disc list-inside mt-2">
                  <li>
                    Menggunakan <span className="font-semibold">Ogrenci Belgesi</span>.
                  </li>
                  <li>
                    Berkas dapat diambil dari <span className="font-semibold">sistem OBS</span>{" "}
                    ataupun dari <span className="font-semibold">Ogrenci Isleri</span>.
                  </li>
                  <li>
                    Maksimal berumur <span className="font-semibold">1 minggu</span>.
                  </li>
                </ul>
              </div>
              {file === null ? (
                <div className="lg:w-1/2 flex flex-col justify-center items-center gap-2">
                  <FontAwesomeIcon icon={faFileArrowUp} size="4x" className="text-neutral-300" />
                  <span className="text-neutral-300">File format: PDF / JPG / JPEG / PNG</span>
                  <button
                    className="px-4 py-2 bg-black text-white rounded-lg"
                    onClick={() => buttonRef.current?.click()}
                  >
                    Choose File
                  </button>
                  <input
                    ref={buttonRef}
                    type="file"
                    name="file-input"
                    id="file-input"
                    className="hidden"
                    accept=".jpg, .jpeg, .png, .pdf"
                    onChange={uploadFileHandler}
                  />
                  <span className="text-neutral-300 text-sm">Max size: 2MB</span>
                </div>
              ) : (
                <div className="lg:w-1/2">
                  <embed src={file.src} width="100%" height={300} />
                  <div className="inline-flex gap-2 mt-4 w-full">
                    <button
                      className="px-3 py-1.5 rounded-md text-white bg-red-400 ml-auto"
                      onClick={() => setFile(null)}
                    >
                      Remove
                    </button>
                    <button
                      className="px-3 py-1.5 rounded-md text-white bg-sky-400 inline-flex items-center gap-2"
                      onClick={() => submitHandler()}
                    >
                      Upload
                      {loading && <FontAwesomeIcon icon={faCircleNotch} className="animate-spin" />}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Table */}

          <div className="table mt-4 rounded-md border overflow-hidden">
            <table>
              <thead>
                <tr>
                  <th scope="col">ID</th>
                  <th scope="col">Status</th>
                  <th scope="col">File</th>
                  <th scope="col" className="whitespace-nowrap">
                    Submit Time
                  </th>
                  <th scope="col"></th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr className="bg-white border-b">
                    <td colSpan={5}>
                      <div className="bg-neutral-200 animate-pulse w-full h-6 rounded"></div>
                    </td>
                  </tr>
                ) : data.length > 0 ? (
                  data.map((item) => (
                    <tr key={item.id} className="bg-white border-b">
                      <td scope="row" className="">
                        {item.id.toString()}
                      </td>
                      <td>
                        <RenderStatus status={item.status} />
                      </td>
                      <td>
                        <button
                          className="bg-black px-2 py-1 rounded-md text-white"
                          onClick={() => {
                            setPreviewSrc(item.img)
                            setModal(true)
                          }}
                        >
                          Open file
                        </button>
                      </td>
                      <td>{item.createdAt.toLocaleString()}</td>
                      <td>
                        <button
                          className="inline-flex gap-2 items-center bg-red-400 px-2 py-1 text-white rounded-md"
                          onClick={() => deleteData(item.id)}
                        >
                          Delete
                          <FontAwesomeIcon icon={faTrashCan} />
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
        </section>
      </SettingsPageWrapper>
    </>
  )
}

function RenderStatus({ status }: { status: $Enums.ActivationRequestStatus }) {
  function state(status: $Enums.ActivationRequestStatus): string | undefined {
    if (status === "APPROVED") return "text-green-400 bg-green-50 border-green-400"
    if (status === "PENDING") return "text-yellow-400 bg-yellow-50 border-yellow-400"
    if (status === "REJECTED") return "text-red-400 bg-red-50 border-red-400"
  }

  return (
    <span className={`rounded-full border text-sm px-3 py-1 tracking-wide ${state(status)}`}>
      {status}
    </span>
  )
}
