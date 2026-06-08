import { NextRequest, NextResponse } from 'next/server'
import { getPayloadClient } from '@/lib/payloadClient'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { orgName, orgType, country, website, contactName, email, contactRole, projectInterests, message, howHeard } = body

    if (!orgName || !orgType || !country || !contactName || !email || !message || !projectInterests?.length) {
      return NextResponse.json({ error: 'Please fill in all required fields.' }, { status: 400 })
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Please enter a valid email address.' }, { status: 400 })
    }

    const payload = await getPayloadClient()

    await payload.create({
      collection: 'partner-applications' as any,
      data: {
        orgName,
        orgType,
        country,
        website:         website  || undefined,
        contactName,
        email,
        contactRole:     contactRole  || undefined,
        projectInterests,
        message,
        howHeard:        howHeard || undefined,
        status:          'new' as any,
      },
    })

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('[partner-application]', err)
    return NextResponse.json({ error: 'Something went wrong. Please try again.' }, { status: 500 })
  }
}
