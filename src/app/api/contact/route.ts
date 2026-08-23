import { NextRequest, NextResponse } from 'next/server'
import { getPayloadClient } from '@/lib/payloadClient'

const MAX = { name: 200, email: 200, subject: 300, message: 5000 }

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const name    = typeof body.name    === 'string' ? body.name.trim()    : ''
    const email   = typeof body.email   === 'string' ? body.email.trim()   : ''
    const subject = typeof body.subject === 'string' ? body.subject.trim() : ''
    const message = typeof body.message === 'string' ? body.message.trim() : ''

    if (!name || !email || !subject || !message) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 })
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Please enter a valid email address.' }, { status: 400 })
    }

    if (
      name.length > MAX.name || email.length > MAX.email ||
      subject.length > MAX.subject || message.length > MAX.message
    ) {
      return NextResponse.json({ error: 'One or more fields are too long.' }, { status: 400 })
    }

    const payload = await getPayloadClient()

    // `status` is hardcoded, never taken from the request body - it is an
    // admin-only field and must not be settable from the public form.
    await payload.create({
      collection: 'contact-messages',
      data: { name, email, subject, message, status: 'new' },
    })

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('[contact]', err)
    return NextResponse.json({ error: 'Something went wrong. Please try again.' }, { status: 500 })
  }
}
