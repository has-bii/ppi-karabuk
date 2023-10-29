import { Metadata } from "next"
import HeroImage from "@/components/HeroImage"

export const metadata: Metadata = {
  title: "PPI Karabuk | Home",
}

export default function Home() {
  return (
    <main>
      <section className="flex flex-col lg:flex-row divide-y-2 lg:divide-y-0 lg:divide-x-2 divide-black lg:h-[38rem] border-b-2 border-black">
        <div className="self-center block w-full px-12 py-12 lg:py-0 lg:w-3/5">
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
            <button className="button white" disabled>
              Tentang kami
            </button>
          </div>
        </div>

        <HeroImage />
      </section>
    </main>
  )
}
