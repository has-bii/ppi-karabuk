import fs from "fs"
import crypto from "crypto"

export default async function getSecretKey() {
  try {
    const MARKER = "JWT_SECRET="

    const JWT_SECRET = process.env.JWT_SECRET

    if (JWT_SECRET === undefined || JWT_SECRET.length === 0) {
      let secret = crypto.randomBytes(32).toString("hex")

      const data = fs.readFileSync(".env", "utf-8")

      let markerIndex = data.indexOf(MARKER)

      const updatedContent =
        data.slice(0, markerIndex === -1 ? data.length : markerIndex + MARKER.length) +
        `${
          markerIndex === -1
            ? `${data[data.length - 1] !== "\n" ? "\n" + MARKER : MARKER}` + secret
            : secret
        }` +
        data.slice(markerIndex === -1 ? data.length : markerIndex + MARKER.length)

      fs.writeFileSync(".env", updatedContent, "utf-8")

      console.log("JWT Secret has been created.")

      return secret
    }

    return JWT_SECRET
  } catch (error) {
    console.log("Failed to generate Secret Key!", error)

    throw error
  }
}
