import Image from "next/image"
import logoppi from "../../public/icon.png"
import Link from "next/link"

export default function Logo() {
  return (
    <Link href="/" className="inline-flex gap-2 items-center">
      <Image
        src={logoppi}
        width="50"
        height="50"
        alt="Logo PPI Karabuk"
        style={{
          maxWidth: "100%",
          height: "auto",
        }}
        quality={100}
        priority={true}
      />
      <div className="font-black text-xl uppercase leading-none text-left">
        <span className="block">PPI</span>
        <span className="block">Karabuk</span>
      </div>
    </Link>
  )
}
