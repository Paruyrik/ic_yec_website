'use server'

import type { Project } from '@/payload-types'
import { getPayloadClient } from '@/lib/payloadClient'
import { buildProjectWhere, type ProjectFilters } from '@/lib/projects'

const LIMIT = 12

export async function loadMoreProjects(
  page: number,
  filters: ProjectFilters,
): Promise<{ docs: Project[]; totalPages: number }> {
  const where = buildProjectWhere(filters)
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
