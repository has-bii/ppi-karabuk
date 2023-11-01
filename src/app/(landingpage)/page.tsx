import { Metadata } from "next"
import HeroImage from "@/components/HeroImage"
import Instagram from "@/components/Instagram"
import Link from "next/link"

export const metadata: Metadata = {
  title: "PPI Karabuk | Home",
}

export default function Home() {
  return (
    <>
      {/* Hero Start */}
      <section className="flex flex-wrap divide-y-2 lg:divide-y-0 lg:divide-x-2 divide-black lg:h-[38rem] border-b-2 border-black">
        <div className="self-center block flex-1 w-2/5 px-12 py-12 lg:py-0">
          <h1 className="mb-5 text-4xl font-light text-center lg:text-left">
            <span className="block font-extrabold text-red-900 lg:text-6xl">
              &quot;PPI Karabük&quot;
            </span>
          </h1>
          <p className="text-xl text-center lg:text-left">
            PPI Karabük adalah wadah berhimpunnya pelajar Indonesia di Karabük untuk membina
            anggota, pendalaman etika, ilmu, akselerasi potensi diri dan penyaluran aspirasi.
          </p>
          <div className="flex justify-center gap-4 mt-4 lg:justify-start">
            <button className="button" disabled>
              Daftar kuliah
            </button>
            <button className="button btn-white" disabled>
              Tentang kami
            </button>
          </div>
        </div>

        <HeroImage />
      </section>
      {/* Hero End */}

      {/* Instagram Section */}
      <section className="section flex flex-col justify-center items-center spacing">
        <h2>Instagram</h2>
        <Instagram />
        <Link
          href="https://www.instagram.com/ppikarabuk/"
          target="_blank"
          className="button btn-white w-fit btn-big font-bold mt-8"
        >
          Open Instagram
        </Link>
      </section>
    </>
  )
}
