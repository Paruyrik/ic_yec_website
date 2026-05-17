import { NextResponse } from 'next/server'
import { sendEmail } from '@/lib/email'

export async function GET() {
  try {
    await sendEmail({
      from: process.env.EMAIL_FROM ?? 'IC-YEC <test@ic-yec.org>',
      to: 'admin@ic-yec.org',
      subject: 'Test email — IC-YEC',
      html: '<h1>It works!</h1><p>Mailpit is receiving emails correctly.</p>',
    })
    return NextResponse.json({ ok: true, message: 'Email sent — check Mailpit at http://localhost:8025' })
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err.message }, { status: 500 })
  }
}
