import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const { name, email, subject, message } = await req.json()

  if (!name || !email || !subject || !message) {
    return NextResponse.json({ error: 'All fields are required' }, { status: 400 })
  }

  // Log to console in development — replace with Resend when email is configured
  console.log('[Contact form]', { name, email, subject, message })

  return NextResponse.json({ ok: true })
}
