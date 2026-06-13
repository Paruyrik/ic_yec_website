import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@/payload.config'

type Decision = 'shortlisted' | 'accepted' | 'rejected'

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export async function PATCH(req: NextRequest) {
  const body = await req.json() as { ids?: unknown; status?: unknown; sendEmail?: unknown }

  const ids      = Array.isArray(body.ids) ? (body.ids as string[]) : []
  const status   = body.status as Decision
  const sendEmail = body.sendEmail !== false

  if (!ids.length) {
    return NextResponse.json({ error: 'ids array is required' }, { status: 400 })
  }
  if (!['shortlisted', 'accepted', 'rejected'].includes(status)) {
    return NextResponse.json({ error: 'Invalid status' }, { status: 400 })
  }

  const payload = await getPayload({ config: await config })
  const results: { id: string; ok: boolean; error?: string }[] = []

  for (const id of ids) {
    try {
      await payload.update({ collection: 'registrations', id, data: { status } })

      // shortlisted is internal - never send email
      if (sendEmail && status !== 'shortlisted') {
        await fetch(
          `${process.env.NEXT_PUBLIC_SERVER_URL ?? 'http://localhost:3000'}/api/send-decision-email`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ registrationId: id, decision: status }),
          },
        )
        await delay(300)
      }

      results.push({ id, ok: true })
    } catch (err) {
      results.push({ id, ok: false, error: String(err) })
    }
  }

  const failed = results.filter((r) => !r.ok)
  return NextResponse.json(
    { updated: results.filter((r) => r.ok).length, failed },
    { status: failed.length ? 207 : 200 },
  )
}
