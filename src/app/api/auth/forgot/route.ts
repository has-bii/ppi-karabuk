import prisma from "@/lib/prisma"

export async function POST(req: Request) {
  try {
    const { email }: { email: string } = await req.json()

    if (!email) return Response.json({ message: "Email is required!" }, { status: 400 })

    // Check Exists record
    const checkEmail = await prisma.user.findUnique({ where: { email: email.toLowerCase() } })

    if (!checkEmail)
      return Response.json(
        {
          message: "Email does not exist!",
          error: { email: "Email does not exist!" },
        },
        { status: 409 }
      )

    return Response.json({ message: "Reset code has been sent." }, { status: 200 })
  } catch (error) {
    console.error("Error at /api/auth/forgot API endpoint: ", error)
    return Response.json({ message: "Internal server error" }, { status: 500 })
  }
}
