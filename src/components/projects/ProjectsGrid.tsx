'use client'

import Link from 'next/link'
import { useCallback, useEffect, useRef, useState } from 'react'
import type { Project } from '@/payload-types'
import { LiveBadge } from '@/components/ui/LiveBadge'
import { deriveProjectStatus, type ProjectFilters } from '@/lib/projects'
import { loadMoreProjects } from '@/app/(frontend)/projects/actions'

// ── helpers ────────────────────────────────────────────────────────────────────

function localStr(val: unknown): string {
  if (!val) return ''
  if (typeof val === 'string') return val
  return (val as any)?.en ?? ''
}

function dateRange(p: Project): string {
  const fmt = (d: string) =>
    new Date(d).toLocaleDateString('en-GB', { month: 'short', year: 'numeric' })
  if (p.startDate && p.endDate) return `${fmt(p.startDate as string)} – ${fmt(p.endDate as string)}`
  if (p.startDate) return `From ${fmt(p.startDate as string)}`
  return ''
}

const STATUS_STYLE: Record<string, { bg: string; text: string; label: string }> = {
  ongoing:   { bg: '#EAF3DE', text: '#3B6D11', label: 'Ongoing' },
  completed: { bg: '#E6F1FB', text: '#0C447C', label: 'Completed' },
  upcoming:  { bg: '#FAEEDA', text: '#633806', label: 'Upcoming' },
}

const ROLE_BADGE: Record<string, { bg: string; text: string; label: string }> = {
  coordinator: { bg: '#EDE9FE', text: '#5B21B6', label: '⭐ Coordinated' },
  partner:     { bg: '#D1FAE5', text: '#065F46', label: '🤝 Partnership' },
}

const THEME_COLORS: Record<string, string> = {
  art:                  '#3D3785',
  sport:                '#4F9A5E',
  'emotional-intelligence': '#0891B2',
  training:             '#D97706',
  inclusion:            '#7C3AED',
  digital:              '#0C447C',
  environment:          '#3B6D11',
}

// ── card ────────────────────────────────────────────────────────────────────────

function ProjectCard({ p }: { p: any }) {
  const title    = localStr(p.title)
  const summary  = localStr(p.summary)
  const statusKey = deriveProjectStatus(p.startDate, p.endDate)
  const status   = STATUS_STYLE[statusKey]
  const themes: string[] = Array.isArray(p.theme) ? p.theme : p.theme ? [p.theme] : []
  const countries: string[] = (p.countries ?? []).map((c: any) => c.country).filter(Boolean)
  const coverUrl = p.coverImage?.url ?? null
  const roleBadge = ROLE_BADGE[p.projectRole as string] ?? null

  return (
    <Link href={`/projects/${p.slug}`} style={{ textDecoration: 'none' }}>
      <div className="card" style={{ height: '100%' }}>
        <div style={{
          height: 180,
          background: coverUrl
            ? `url(${coverUrl}) center/cover`
            : `linear-gradient(135deg, ${THEME_COLORS[themes[0]] ?? '#3D3785'}22 0%, ${THEME_COLORS[themes[0]] ?? '#3D3785'}44 100%)`,
          display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', padding: 12,
        }}>
          <span style={{
            padding: '3px 10px', borderRadius: 100, fontSize: 11, fontWeight: 500,
            background: status.bg, color: status.text,
          }}>
            {status.label}
          </span>
          {statusKey === 'ongoing' && <LiveBadge variant="live" />}
        </div>

        <div className="card__body">
          {(themes.length > 0 || roleBadge) && (
            <div className="card__meta">
              {themes.slice(0, 3).map((t) => (
                <span key={t} style={{
                  padding: '2px 8px', borderRadius: 100, fontSize: 10, fontWeight: 500,
                  textTransform: 'uppercase', letterSpacing: '0.06em',
                  background: `${THEME_COLORS[t] ?? '#3D3785'}18`,
                  color: THEME_COLORS[t] ?? '#3D3785',
                }}>
                  {t}
                </span>
              ))}
              {roleBadge && (
                <span style={{
                  padding: '2px 8px', borderRadius: 100, fontSize: 10, fontWeight: 600,
                  background: roleBadge.bg, color: roleBadge.text,
                }}>
                  {roleBadge.label}
                </span>
              )}
            </div>
          )}

          <h3 className="card__title">{title}</h3>
          {summary && (
            <p className="card__desc">{summary.slice(0, 110)}{summary.length > 110 ? '…' : ''}</p>
          )}

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, fontSize: 12, color: 'var(--color-text-muted)', marginTop: 'auto' }}>
            {dateRange(p) && <span>🗓 {dateRange(p)}</span>}
            {countries.length > 0 && <span>🌍 {countries.slice(0, 3).join(', ')}{countries.length > 3 ? ` +${countries.length - 3}` : ''}</span>}
            {p.participants > 0 && <span>👥 {p.participants}</span>}
          </div>

          <span className="card__link" style={{ marginTop: 12 }}>View project →</span>
        </div>
      </div>
    </Link>
  )
}

// ── infinite-scroll grid ────────────────────────────────────────────────────────

export function ProjectsGrid({
  initialProjects,
  initialTotalPages,
  filters,
  hasFilter,
}: {
  initialProjects: Project[]
  initialTotalPages: number
  filters: ProjectFilters
  hasFilter: boolean
}) {
  const [projects, setProjects] = useState<Project[]>(initialProjects)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(initialTotalPages)
  const [loading, setLoading] = useState(false)
  const sentinelRef = useRef<HTMLDivElement | null>(null)

  // Reset when the server re-renders with new filters / initial data.
  useEffect(() => {
    setProjects(initialProjects)
    setPage(1)
    setTotalPages(initialTotalPages)
  }, [initialProjects, initialTotalPages])

  const hasMore = page < totalPages

  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return
    setLoading(true)
    const next = page + 1
    try {
      const { docs, totalPages: tp } = await loadMoreProjects(next, filters)
      setProjects((prev) => {
        const seen = new Set(prev.map((p) => p.id))
        return [...prev, ...docs.filter((d) => !seen.has(d.id))]
      })
      setTotalPages(tp)
      setPage(next)
    } finally {
      setLoading(false)
    }
  }, [loading, hasMore, page, filters])

  useEffect(() => {
    const el = sentinelRef.current
    if (!el || !hasMore) return
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) loadMore()
      },
      { rootMargin: '400px 0px' },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [loadMore, hasMore])

  if (projects.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '64px 0', color: 'var(--color-text-muted)' }}>
        {hasFilter
          ? 'No projects match your filters. Try adjusting your search.'
          : 'No projects yet. Check back soon.'}
      </div>
    )
  }

  return (
    <>
      <div className="grid-3">
        {projects.map((p) => (
          <ProjectCard key={p.id} p={p} />
        ))}
      </div>

      {/* Sentinel + loading state */}
      {hasMore && (
        <div ref={sentinelRef} style={{ height: 1 }} aria-hidden />
      )}
      {loading && (
        <div style={{ textAlign: 'center', padding: '32px 0', color: 'var(--color-text-muted)', fontSize: 14 }}>
          Loading more projects…
        </div>
      )}
    </>
  )
}
