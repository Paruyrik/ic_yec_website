import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import type { Where } from 'payload'
import config from '@/payload.config'
import JSZip from 'jszip'

// ── CSV helper ────────────────────────────────────────────────────────────────

function toCSV(rows: Record<string, unknown>[]): string {
  if (!rows.length) return ''
  const headers = Object.keys(rows[0]!)
  const escape  = (v: unknown) => `"${String(v ?? '').replace(/"/g, '""')}"`
  return [
    headers.join(','),
    ...rows.map((r) => headers.map((h) => escape(r[h])).join(',')),
  ].join('\n')
}

// ── Route ────────────────────────────────────────────────────────────────────

export async function GET(req: NextRequest) {
  const sp         = req.nextUrl.searchParams
  const openCallId = sp.get('openCallId') ?? undefined
  const status     = sp.get('status')     ?? undefined
  const format     = sp.get('format')     ?? 'csv'
  const idsParam   = sp.get('ids')        ?? undefined

  const payload = await getPayload({ config: await config })

  // Build where clause
  const conditions: Where[] = []
  if (idsParam) {
    const ids = idsParam.split(',').map((s) => s.trim()).filter(Boolean)
    if (ids.length) conditions.push({ id: { in: ids } })
  }
  if (openCallId) conditions.push({ openCall: { equals: openCallId } })
  if (status)     conditions.push({ status:   { equals: status } })
  const where: Where | undefined = conditions.length === 0 ? undefined
    : conditions.length === 1 ? conditions[0]
    : { and: conditions }

  const { docs } = await payload.find({
    collection: 'registrations',
    where,
    limit: 1000,
    depth: 1,
  })

  // ── CSV export ──────────────────────────────────────────────────────────

  if (format === 'csv') {
    const rows = docs.map((r: any) => ({
      id:               r.id,
      applicantName:    r.applicantName,
      email:            r.email,
      phone:            r.phone ?? '',
      country:          r.country,
      dateOfBirth:      r.dateOfBirth ? new Date(r.dateOfBirth).toLocaleDateString('en-GB') : '',
      status:           r.status,
      openCall:         typeof r.openCall === 'object' ? (r.openCall as any)?.title ?? r.openCall?.id : r.openCall,
      motivationLetter: (r.motivationLetter ?? '').replace(/\n/g, ' '),
      submittedAt:      new Date(r.createdAt).toLocaleDateString('en-GB'),
      gdprConsent:      r.gdprConsent ? 'yes' : 'no',
    }))

    return new NextResponse(toCSV(rows), {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="registrations-${Date.now()}.csv"`,
      },
    })
  }

  // ── ZIP of CVs ──────────────────────────────────────────────────────────

  if (format === 'zip') {
    const zip = new JSZip()
    const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL ?? 'http://localhost:3000'

    for (const reg of docs as any[]) {
      if (!reg.cv) continue
      // cv is now in the `documents` collection; fall back to `media` for legacy records
      const cvUrl = typeof reg.cv === 'object'
        ? reg.cv.url                              // uploadthing returns absolute URLs
        : `${serverUrl}/api/documents/file/${reg.cv}`

      try {
        const res  = await fetch(cvUrl)
        if (!res.ok) continue
        const buf  = await res.arrayBuffer()
        const ext  = cvUrl.split('.').pop() ?? 'pdf'
        const name = `${reg.applicantName.replace(/\s+/g, '_')}_${reg.id}.${ext}`
        zip.file(name, buf)
      } catch {
        // skip missing files
      }
    }

    const zipBuffer = await zip.generateAsync({ type: 'arraybuffer' })
    return new NextResponse(zipBuffer, {
      headers: {
        'Content-Type': 'application/zip',
        'Content-Disposition': `attachment; filename="cvs-${Date.now()}.zip"`,
      },
    })
  }

  return NextResponse.json({ error: `Unknown format: ${format}` }, { status: 400 })
}
