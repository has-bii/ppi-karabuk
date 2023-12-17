"use client"

import Image from "next/image"
import AliceCarousel from "react-alice-carousel"
import "@/styles/alice-carousel.css"
import { useRef } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faAngleLeft, faAngleRight } from "@fortawesome/free-solid-svg-icons"
import CarouselDot from "../Carousel/CarouselDot"

const images = [
  { src: "/images/home/hero.jpg", alt: "Welcoming Maba 2022" },
  { src: "/images/home/hero2.jpg", alt: "Welcoming Maba 2022" },
  { src: "/images/home/hero3.jpg", alt: "Welcoming Maba 2022" },
  { src: "/images/home/hero4.jpg", alt: "Welcoming Maba 2022" },
  { src: "/images/home/hero5.jpg", alt: "Welcoming Maba 2022" },
]

const items = images.map((item, index) => (
  <div key={index} className="relative w-full h-96 lg:h-[38rem]">
    <Image
      src={item.src}
      alt={item.alt}
      fill
      priority
      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 100vw"
      style={{ objectFit: "cover" }}
    />
  </div>
))

export default function HeroImage() {
  const carousel = useRef<AliceCarousel>(null)

  return (
    <div className="w-full lg:w-3/5 h-96 lg:h-full overflow-hidden relative bg-black group">
      <button
        className="absolute left-4 top-1/2 -translate-y-1/2 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-200 ease-in-out"
        onClick={(e) => carousel?.current?.slidePrev(e)}
      >
        <FontAwesomeIcon icon={faAngleLeft} className="text-white" size="2xl" />
      </button>
      <AliceCarousel
        autoPlay
        autoPlayInterval={3000}
        autoHeight
        infinite
        mouseTracking
        disableButtonsControls
        renderDotsItem={CarouselDot}
        items={items}
        ref={carousel}
      />
      <button
        className="absolute right-4 top-1/2 -translate-y-1/2 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-200 ease-in-out"
        onClick={(e) => carousel?.current?.slideNext(e)}
      >
        <FontAwesomeIcon icon={faAngleRight} className="text-white" size="2xl" />
      </button>
    </div>
  )
}
