import prisma from "@/lib/prisma"
import generateFileName from "@/utils/generateFileName"
import getUser from "@/utils/getUser"
import { existsSync, unlinkSync, writeFileSync } from "fs"
import { NextRequest } from "next/server"
import { zfd } from "zod-form-data"
import bcrypt from "bcrypt"

const schema = zfd.formData({
  name: zfd.text().optional(),
  email: zfd.text().optional(),
  studentId: zfd.text().optional(),
  kimlikId: zfd.text().optional(),
  password: zfd.text().optional(),
  newPassword: zfd.text().optional(),
})

export async function PUT(req: NextRequest) {
  try {
    const user = await getUser(req)

    const formData = await req.formData()

    const data = schema.parse(formData)

    const image: File | null = formData.get("image") as unknown as File

    let path: string | null = null

    if (image !== null) {
      if (!image.type.startsWith("image"))
        return Response.json({ message: "Invalid image type!" }, { status: 400 })

      const bytes = await image.arrayBuffer()
      const buffer = Buffer.from(bytes)

      path = "/images/profiles/" + generateFileName(image.name)
      writeFileSync("public" + path, buffer)

      if (user.img && existsSync("public" + user.img)) unlinkSync("public" + user.img)
    }

    if (data.email || data.newPassword) {
      if (!data.password)
        return Response.json({ message: "Password is required!" }, { status: 400 })

      // Check password
      if (!bcrypt.compareSync(data.password, user.password))
        return Response.json({ message: "Invalid password!" }, { status: 401 })
    }

    await prisma.user.update({
      where: { id: user.id },
      data: {
        name: data.name?.toLowerCase(),
        email: data.email?.toLowerCase(),
        password: data.newPassword ? bcrypt.hashSync(data.newPassword, 12) : user.password,
        studentId: data.studentId,
        kimlikId: data.kimlikId,
        img: path || user.img,
      },
    })

    return Response.json({ message: "Updated successfully." }, { status: 200 })
  } catch (error) {
    console.error("Error while updating user info: ", error)
    return Response.json({ message: "Internal server error" }, { status: 500 })
  }
}
