'use server'

import type { Where } from 'payload'
import type { Project } from '@/payload-types'
import { getPayloadClient } from '@/lib/payloadClient'

export type ProjectFilters = {
  status?: string
  theme?: string
  role?: string
  q?: string
}

const LIMIT = 12

export async function loadMoreProjects(
  page: number,
  filters: ProjectFilters,
): Promise<{ docs: Project[]; totalPages: number }> {
  const where: Where = {}
  if (filters.status) where.status      = { equals: filters.status }
  if (filters.theme)  where.theme       = { in: [filters.theme] }
  if (filters.role)   where.projectRole = { equals: filters.role }
  if (filters.q)      where.or          = [
    { title:   { like: filters.q } },
    { summary: { like: filters.q } },
  ]

  const hasFilter = filters.status || filters.theme || filters.role || filters.q

  const { docs, totalPages } = await payloadFind(page, hasFilter ? where : undefined)
  return { docs, totalPages }
}

async function payloadFind(page: number, where?: Where) {
  const payload = await getPayloadClient()
  return payload
    .getCachedCollection<'projects'>({
      collection: 'projects',
      limit: LIMIT,
      page,
      sort: 'order',
      depth: 1,
      ...(where ? { where } : {}),
    })
    .catch(() => ({ docs: [] as Project[], totalPages: 1 }))
}
