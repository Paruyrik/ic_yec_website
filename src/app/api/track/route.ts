import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@/payload.config'

// Simple rate limiting — max 5 lookups per IP per minute (in-memory, resets on cold start)
const ratemap = new Map<string, { count: number; reset: number }>()

function checkRate(ip: string): boolean {
  const now   = Date.now()
  const entry = ratemap.get(ip)
  if (!entry || now > entry.reset) {
    ratemap.set(ip, { count: 1, reset: now + 60_000 })
    return true
  }
  if (entry.count >= 5) return false
  entry.count++
  return true
}

export async function GET(req: NextRequest) {
  const ip    = req.headers.get('x-forwarded-for') ?? 'unknown'
  const email = req.nextUrl.searchParams.get('email')?.trim().toLowerCase()

  if (!email) return NextResponse.json({ error: 'email is required' }, { status: 400 })
  if (!checkRate(ip)) return NextResponse.json({ error: 'Too many requests. Please wait a minute.' }, { status: 429 })

  const payload = await getPayload({ config: await config })

  const { docs } = await payload.find({
    collection: 'registrations',
    where: { email: { equals: email } },
    sort: '-createdAt',
    limit: 20,
    depth: 1,
    // Only return safe public fields — never expose notes or full answers
    select: {
      id:         true,
      status:     true,
      createdAt:  true,
      openCall:   true,
    },
  } as any)

  if (docs.length === 0) {
    return NextResponse.json({ applications: [] })
  }

  const applications = docs.map((r: any) => ({
    id:           r.id,
    status:       r.status,
    submittedAt:  r.createdAt,
    openCallTitle: typeof r.openCall === 'object' ? r.openCall?.title ?? '—' : '—',
    openCallSlug:  typeof r.openCall === 'object' ? r.openCall?.slug  ?? null : null,
  }))

  return NextResponse.json({ applications })
}
