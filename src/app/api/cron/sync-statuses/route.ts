import { NextRequest, NextResponse } from 'next/server'
import { getPayloadClient } from '@/lib/payloadClient'
import { revalidateCollection } from '@/lib/revalidate'

export const dynamic = 'force-dynamic'
export const maxDuration = 30

export async function GET(req: NextRequest) {
  // Verify the request comes from Vercel's cron scheduler
  const authHeader = req.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const payload = await getPayloadClient()
  const now = new Date().toISOString()

  const summary = {
    projects: { ongoing: 0, completed: 0 },
    openCalls: { closed: 0 },
  }

  // ── Projects: upcoming → ongoing ─────────────────────────────────────────
  const startingProjects = await payload.find({
    collection: 'projects',
    where: {
      and: [
        { status:    { equals: 'upcoming' } },
        { startDate: { less_than_equal: now } },
      ],
    },
    limit: 100,
    depth: 0,
  })

  for (const project of startingProjects.docs) {
    await payload.update({
      collection: 'projects',
      id: project.id,
      data: { status: 'ongoing' },
    })
    summary.projects.ongoing++
  }

  // ── Projects: ongoing → completed ────────────────────────────────────────
  const endingProjects = await payload.find({
    collection: 'projects',
    where: {
      and: [
        { status:  { equals: 'ongoing' } },
        { endDate: { less_than_equal: now } },
      ],
    },
    limit: 100,
    depth: 0,
  })

  for (const project of endingProjects.docs) {
    await payload.update({
      collection: 'projects',
      id: project.id,
      data: { status: 'completed' },
    })
    summary.projects.completed++
  }

  // ── Open calls: open → closed (past deadline) ────────────────────────────
  const expiredCalls = await payload.find({
    collection: 'open-calls',
    where: {
      and: [
        { status:   { equals: 'open' } },
        { deadline: { less_than: now } },
      ],
    },
    limit: 100,
    depth: 0,
  })

  for (const call of expiredCalls.docs) {
    await payload.update({
      collection: 'open-calls',
      id: call.id,
      data: { status: 'closed' },
    })
    summary.openCalls.closed++
  }

  // ── Revalidate caches if anything changed ────────────────────────────────
  const anyChanges =
    summary.projects.ongoing > 0 ||
    summary.projects.completed > 0 ||
    summary.openCalls.closed > 0

  if (anyChanges) {
    revalidateCollection('projects')
    revalidateCollection('open-calls')
  }

  return NextResponse.json({ ok: true, timestamp: now, summary })
}
