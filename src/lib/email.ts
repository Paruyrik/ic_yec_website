import nodemailer from 'nodemailer'

type EmailPayload = {
  from: string
  to: string
  cc?: string[]
  subject: string
  html: string
}

function createTransport() {
  if (process.env.NODE_ENV === 'development') {
    return nodemailer.createTransport({
      host: 'localhost',
      port: 1025,
      secure: false,
    })
  }

  return nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD,
    },
  })
}

export async function sendEmail({ from, to, cc, subject, html }: EmailPayload) {
  const transporter = createTransport()
  await transporter.sendMail({ from, to, cc, subject, html })

  if (process.env.NODE_ENV === 'development') {
    console.log(`[email:dev] → ${to} | ${subject}`)
  }
}
