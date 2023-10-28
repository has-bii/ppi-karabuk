import prisma from "@/lib/prisma"
import bcrypt from "bcrypt"

export async function POST(req: Request) {
  try {
    if (req.method !== "POST") return Response.json({ message: "Invalid method!" }, { status: 400 })

    const formData = await req.formData()
    const name = formData.get("name")?.toString().toLowerCase()
    const email = formData.get("email")?.toString().toLowerCase()
    const studentId = formData.get("studentId")?.toString()
    const kimlikId = formData.get("kimlikId")?.toString()
    const password = formData.get("password")?.toString()

    if (!name || !email || !studentId || !kimlikId || !password)
      return Response.json(
        { message: "Name, email, student id, kimlik id and password are required!" },
        { status: 400 }
      )

    // Check Exists record
    const checkEmail = await prisma.user.findUnique({ where: { email: email } })

    if (checkEmail)
      return Response.json({ message: "Email is already registered!" }, { status: 409 })

    const checkStudentId = await prisma.user.findUnique({ where: { studentId: studentId } })

    if (checkStudentId)
      return Response.json({ message: "Student ID is already registered!" }, { status: 409 })

    const checkKimlikId = await prisma.user.findUnique({ where: { kimlikId: kimlikId } })

    if (checkKimlikId)
      return Response.json({ message: "Kimlik ID is already registered!" }, { status: 409 })
    // End

    await prisma.user.create({
      data: {
        name: name,
        email: email,
        studentId: studentId,
        kimlikId: kimlikId,
        password: bcrypt.hashSync(password, 12),
      },
    })

    return Response.json({ message: "User has been registered successfully." }, { status: 200 })
  } catch (error) {
    console.error("Error at /api/auth/register route: ", error)
    return Response.json({ message: "Internal server error" }, { status: 500 })
  }
}
