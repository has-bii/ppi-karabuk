"use client"

import AliceCarousel from "react-alice-carousel"
import "@/styles/alice-carousel.css"
import Image from "next/image"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faAngleLeft, faAngleRight } from "@fortawesome/free-solid-svg-icons"
import { useEffect, useRef, useState } from "react"
import { InstagramData } from "@/types"
import axios from "axios"
import Link from "next/link"
import Video from "@/components/LandingPage/Video"

export default function Instagram() {
  const carousel = useRef<AliceCarousel>(null)
  const [data, setData] = useState<InstagramData[]>([])

  async function fetch() {
    try {
      const res = await axios.get<{ message: string; data: InstagramData[] }>("/api/instagram")

      if (res.data) setData(res.data.data)
    } catch (error) {
      return null
    }
  }

  useEffect(() => {
    fetch()
  }, [])
  return (
    <div className="container px-0 lg:px-4 relative">
      <button
        className="absolute -left-8 top-1/2 -translate-y-1/2 z-10 hidden md:block"
        onClick={(e) => carousel?.current?.slidePrev(e)}
      >
        <FontAwesomeIcon icon={faAngleLeft} className="text-black" size="2xl" />
      </button>
      <AliceCarousel
        autoPlayInterval={3000}
        autoWidth
        infinite
        mouseTracking
        disableButtonsControls
        disableDotsControls
        items={RenderImage(data)}
        ref={carousel}
      />
      <button
        className="absolute -right-8 top-1/2 -translate-y-1/2 z-10 hidden md:block"
        onClick={(e) => carousel?.current?.slideNext(e)}
      >
        <FontAwesomeIcon icon={faAngleRight} className="text-black" size="2xl" />
      </button>
    </div>
  )
}

function RenderImage(data: InstagramData[]) {
  if (data.length === 0)
    return Array(10)
      .fill("")
      .map((item, index) => (
        <div
          key={index}
          className="w-[24rem] h-[30rem] md:w-[20rem] md:h-[25rem] px-2 relative group"
        >
          <div className="w-full h-full border-2 border-black bg-black"></div>
        </div>
      ))
  else
    return data.map((item, index) => (
      <div
        key={index}
        className="w-[24rem] h-[30rem] md:w-[20rem] md:h-[25rem] px-2 relative group"
      >
        <div className="relative w-full h-full overflow-hidden border-2 border-black bg-black">
          {item.media_type === "VIDEO" ? (
            <Video media_url={item.media_url} thumbnail_url={item.thumbnail_url} />
          ) : (
            <Image
              key={index}
              src={item.media_url}
              alt=""
              fill
              priority
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              style={{ objectFit: "cover", objectPosition: "center" }}
              className="group-hover:scale-110 transition-transform duration-300 ease-out"
            />
          )}
        </div>
        <div className="absolute transition-[bottom] duration-200 ease-out -bottom-full group-hover:bottom-4 left-1/2 -translate-x-1/2 w-5/6 h-fit px-4 py-2 border-2 border-black bg-white">
          <p className="text-black text-justify whitespace-pre font-semibold line-clamp-4">
            {item.caption}
          </p>
          <Link
            href={item.permalink}
            target="_blank"
            className="text-blue-500 font-semibold underline"
          >
            Open on Instagram
          </Link>
        </div>
      </div>
    ))
}
