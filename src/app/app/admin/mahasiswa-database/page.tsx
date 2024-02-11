import PageWrapper from "@/components/app/PageWrapper"
import React from "react"
import navSideAdmin from "../navSideAdmin"

export default async function Page() {
  return (
    <PageWrapper url="/admin" navSideItems={navSideAdmin}>
      <div></div>
    </PageWrapper>
  )
}
