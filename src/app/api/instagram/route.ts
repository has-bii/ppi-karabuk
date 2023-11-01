import axios from "axios"

export async function GET() {
  try {
    const res = await axios.get(
      `https://graph.instagram.com/me/media?fields=id,caption,media_type,media_url,thumbnail_url,permalink&limit=10&access_token=${process.env.LONG_LIVED_TOKEN}`
    )

    return Response.json(
      { message: "Fetch successful.", data: res.data ? res.data.data : [] },
      { status: 200 }
    )
  } catch (error) {
    console.error("Error while fetching Instagram data: ", error)

    return Response.json({ message: "Internal server error!" }, { status: 500 })
  }
}
