import type { Where } from 'payload'

export type ProjectStatus = 'upcoming' | 'ongoing' | 'completed'

export type ProjectFilters = {
  status?: string
  theme?: string
  role?: string
  q?: string
}

/** Midnight (UTC) for the given date, as a timestamp. */
function utcDay(d: Date): number {
  return Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate())
}

/**
 * Derive a project's status purely from its start/end dates.
 *  - before start date           → upcoming
 *  - after end date              → completed
 *  - in between (or started, no  → ongoing
 *    end date set)
 *  - no dates at all             → upcoming
 *
 * A project is considered ongoing through the whole of its end day, and
 * completed only once that day has fully passed.
 */
export function deriveProjectStatus(
  start?: string | null,
  end?: string | null,
  now: Date = new Date(),
): ProjectStatus {
  const today = utcDay(now)
  const s = start ? utcDay(new Date(start)) : null
  const e = end ? utcDay(new Date(end)) : null

  if (s !== null && s > today) return 'upcoming'
  if (e !== null && e < today) return 'completed'
  if (s !== null || e !== null) return 'ongoing'
  return 'upcoming'
}

/** Start of today / start of tomorrow (UTC) as ISO strings, for date queries. */
function dayBoundaries(now: Date = new Date()) {
  const todayStart = new Date(utcDay(now))
  const tomorrowStart = new Date(utcDay(now) + 86_400_000)
  return { todayStart: todayStart.toISOString(), tomorrowStart: tomorrowStart.toISOString() }
}

/** Translate a derived status filter into an equivalent date-range query. */
export function statusWhere(status: string, now: Date = new Date()): Where {
  const { todayStart, tomorrowStart } = dayBoundaries(now)

  if (status === 'upcoming') {
    return { startDate: { greater_than_equal: tomorrowStart } }
  }
  if (status === 'completed') {
    return { endDate: { less_than: todayStart } }
  }
  // ongoing: already started (or no start) AND not yet ended (or no end)
  return {
    and: [
      { or: [{ startDate: { less_than: tomorrowStart } }, { startDate: { exists: false } }] },
      { or: [{ endDate: { greater_than_equal: todayStart } }, { endDate: { exists: false } }] },
    ],
  }
}

/** Projects that are ongoing or upcoming — i.e. not yet completed. */
export function notCompletedWhere(now: Date = new Date()): Where {
  const { todayStart } = dayBoundaries(now)
  return { or: [{ endDate: { greater_than_equal: todayStart } }, { endDate: { exists: false } }] }
}

/**
 * Build the Payload `where` clause for the projects grid from the active
 * filters. Status is translated to date ranges so it stays consistent with
 * `deriveProjectStatus`. Returns `undefined` when no filters are active.
 */
export function buildProjectWhere(f: ProjectFilters): Where | undefined {
  const and: Where[] = []
  if (f.theme)  and.push({ theme: { in: [f.theme] } })
  if (f.role)   and.push({ projectRole: { equals: f.role } })
  if (f.q)      and.push({ or: [{ title: { like: f.q } }, { summary: { like: f.q } }] })
  if (f.status) and.push(statusWhere(f.status))
  return and.length ? { and } : undefined
}
