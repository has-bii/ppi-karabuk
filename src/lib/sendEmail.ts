import nodemailer from "nodemailer"
import { MailOptions } from "nodemailer/lib/json-transport"

export default function sendEmail(
  receiver: string,
  subject: string,
  text: string,
  type: "RECOVERY" | "VERIFY"
): boolean {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_EMAIL,
      pass: process.env.EMAIL_PASS,
    },
  })

  const mailOptions : MailOptions = {
    from: process.env.EMAIL,
    to: receiver,
    subject: subject,
    html: text,
  }

  let response: boolean = false

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error)
    } else {
      response = true
      console.log(`${type} email has been sent: ${info.response}`)
    }
  })

  return response
}
