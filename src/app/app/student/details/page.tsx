import PageWrapper from "@/components/app/PageWrapper"
import navSideStudent from "../navSideStudent"

export default async function Page() {
  return (
    <PageWrapper url="/student" navSideItems={navSideStudent}>
      <p className="text-2xl text-black font-bold text-left mb-4">Student Details</p>
    </PageWrapper>
  )
}
