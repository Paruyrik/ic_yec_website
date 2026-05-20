import Link from 'next/link'
import { Suspense } from 'react'
import type { Project } from '@/payload-types'
import type { Where } from 'payload'
import { getPayloadClient } from '@/lib/payloadClient'
import { HomeMapClient as ProjectsMap } from '@/components/home/HomeMapClient'
import { ThemeImpactGrid } from '@/components/projects/ThemeImpactGrid'
import { LiveBadge } from '@/components/ui/LiveBadge'
import { ProjectsFilterBar } from '@/components/projects/ProjectsFilterBar'

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

const THEME_COLORS: Record<string, string> = {
  art:                  '#3D3785',
  sport:                '#4F9A5E',
  'emotional-intelligence': '#0891B2',
  training:             '#D97706',
  inclusion:            '#7C3AED',
  digital:              '#0C447C',
  environment:          '#3B6D11',
}

const LIMIT = 12

// ── page ──────────────────────────────────────────────────────────────────────

export default async function ProjectsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const sp = await searchParams
  const currentStatus = (sp.status as string) ?? ''
  const currentTheme  = (sp.theme  as string) ?? ''
  const currentQ      = (sp.q      as string) ?? ''
  const currentPage   = Math.max(1, Number(sp.page ?? 1))

  const payload = await getPayloadClient()

  // ── build where clause for filtered query ──────────────────────────────────
  const where: Where = {}
  if (currentStatus) where.status = { equals: currentStatus }
  if (currentTheme)  where.theme  = { in: [currentTheme] }
  if (currentQ)      where.or     = [
    { title:   { like: currentQ } },
    { summary: { like: currentQ } },
  ]

  const hasFilter = currentStatus || currentTheme || currentQ

  // ── two parallel queries ───────────────────────────────────────────────────
  const [
    { docs: allProjects },
    settings,
    siteSettings,
    { docs: projects, totalDocs, totalPages },
  ] = await Promise.all([
    // All projects: for map, stats, and country pills (unaffected by filters)
    payload.getCachedCollection<'projects'>({
      collection: 'projects',
      limit: 200,
      sort: 'order,-startDate',
      depth: 1,
    }).catch(() => ({ docs: [] as Project[] })),

    payload.getCachedGlobal({ slug: 'projects-settings' as any }).catch(() => null),
    payload.getCachedGlobal({ slug: 'site-settings' as any }).catch(() => null),

    // Filtered + paginated: for the grid
    payload.getCachedCollection<'projects'>({
      collection: 'projects',
      limit: LIMIT,
      page: currentPage,
      sort: 'order,-startDate',
      depth: 1,
      ...(hasFilter ? { where } : {}),
    }).catch(() => ({ docs: [] as Project[], totalDocs: 0, totalPages: 1 })),
  ])

  const ss = siteSettings as any

  // ── derive map data from ALL projects ─────────────────────────────────────
  const allCountries = Array.from(
    new Set(allProjects.flatMap((p) => (p.countries ?? []).map((c: any) => c.country).filter(Boolean)))
  ) as string[]

  const mapEnabled   = (settings as any)?.mapSection?.enabled !== false
  const mapTitle     = localStr((settings as any)?.mapSection?.title) || 'Where we work'
  const mapSubtitle  = localStr((settings as any)?.mapSection?.subtitle)
  const stats: any[] = (settings as any)?.impactStats?.stats ?? []
  const showLiveBadge = true

  const mapCfg             = ss?.mapConfig ?? {}
  const activeCountryColor = mapCfg.activeCountryColor  || '#3D3785'
  const homeCityColor      = mapCfg.homeCityColor        || '#E8A0A0'
  const partnerCityColor   = mapCfg.partnerCityColor     || '#8B85E8'
  const configuredCities   = (mapCfg.cities ?? []) as { city: string; country: string; lat: number; lng: number; isHome?: boolean }[]

  const autoStats = stats.length ? stats : [
    { icon: '📋', value: String(allProjects.length),       label: 'Projects' },
    { icon: '🌍', value: String(allCountries.length),      label: 'Countries reached' },
    { icon: '👥', value: String(allProjects.reduce((s, p: any) => s + (p.participants ?? 0), 0) || '—'), label: 'Participants' },
  ]

  return (
    <>
      {/* Page hero */}
      <div style={{ background: 'var(--color-primary)', padding: '56px 0 44px' }}>
        <div className="container">
          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13, marginBottom: 8 }}>
            <Link href="/" style={{ color: 'inherit' }}>Home</Link> / Projects
          </p>
          <h1 style={{ color: 'white', fontSize: 36 }}>Our Projects</h1>
          <p style={{ color: 'rgba(255,255,255,0.72)', fontSize: 16, marginTop: 10, maxWidth: 560 }}>
            Non-formal education and youth mobility initiatives co-funded by the Erasmus+ Programme.
          </p>
        </div>
      </div>

      {/* Impact stats bar */}
      {autoStats.length > 0 && (
        <div style={{ background: 'var(--color-dark)', padding: '20px 0' }}>
          <div className="container">
            <div style={{ display: 'flex', gap: 0, flexWrap: 'wrap' }}>
              {autoStats.map((s: any, i: number) => (
                <div key={i} style={{
                  flex: '1 1 160px', textAlign: 'center', padding: '12px 24px',
                  borderRight: i < autoStats.length - 1 ? '1px solid rgba(255,255,255,0.1)' : 'none',
                }}>
                  {s.icon && <div style={{ fontSize: 22, marginBottom: 4 }}>{s.icon}</div>}
                  <div style={{ fontSize: 28, fontWeight: 500, color: 'var(--color-accent)' }}>{s.value}</div>
                  <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.55)', marginTop: 2 }}>{localStr(s.label)}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Map section */}
      {mapEnabled && (
        <section style={{ paddingTop: 56, paddingBottom: 48, background: '#0f0e1a' }}>
          <div className="container">
            <div style={{ marginBottom: 28 }}>
              <p style={{ fontSize: 12, fontWeight: 500, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.5)', marginBottom: 8 }}>
                Our reach
              </p>
              <h2 style={{ fontSize: 28, color: 'white' }}>{mapTitle}</h2>
              {mapSubtitle && (
                <p style={{ marginTop: 10, fontSize: 16, color: 'rgba(255,255,255,0.6)', maxWidth: 560 }}>
                  {mapSubtitle}
                </p>
              )}
            </div>
            <ProjectsMap
              activeCountries={allCountries}
              cities={configuredCities.length > 0 ? configuredCities : undefined}
              activeCountryColor={activeCountryColor}
              homeCityColor={homeCityColor}
              partnerCityColor={partnerCityColor}
            />
            {allCountries.length > 0 && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 20 }}>
                {allCountries.sort().map((c) => (
                  <span key={c} style={{
                    padding: '4px 12px', borderRadius: 100,
                    background: 'rgba(255,255,255,0.08)',
                    color: 'rgba(255,255,255,0.75)',
                    fontSize: 13, fontWeight: 500,
                    border: '1px solid rgba(255,255,255,0.12)',
                  }}>
                    {c}
                  </span>
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* Theme impact grid */}
      {(() => {
        const themes = ss?.themeImpact?.themes ?? []
        return themes.length > 0 ? <ThemeImpactGrid themes={themes} /> : null
      })()}

      {/* Projects grid */}
      <section className="section section--tint">
        <div className="container">
          <div style={{ marginBottom: 24 }}>
            <h2 style={{ fontSize: 26, marginBottom: 20 }}>All Projects</h2>

            {/* Filter bar — wrapped in Suspense because it uses useSearchParams */}
            <Suspense fallback={
              <div style={{ height: 42, background: 'rgba(255,255,255,0.5)', borderRadius: 8, animation: 'pulse 1.5s infinite' }} />
            }>
              <ProjectsFilterBar
                total={totalDocs}
                currentStatus={currentStatus}
                currentTheme={currentTheme}
                currentQ={currentQ}
              />
            </Suspense>
          </div>

          {projects.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '64px 0', color: 'var(--color-text-muted)' }}>
              {hasFilter
                ? 'No projects match your filters. Try adjusting your search.'
                : 'No projects yet. Check back soon.'}
            </div>
          ) : (
            <div className="grid-3">
              {projects.map((p: any) => {
                const title    = localStr(p.title)
                const summary  = localStr(p.summary)
                const status   = STATUS_STYLE[p.status] ?? STATUS_STYLE.completed
                const themes: string[] = Array.isArray(p.theme) ? p.theme : p.theme ? [p.theme] : []
                const countries: string[] = (p.countries ?? []).map((c: any) => c.country).filter(Boolean)
                const coverUrl = p.coverImage?.url ?? null

                return (
                  <Link key={p.id} href={`/projects/${p.slug}`} style={{ textDecoration: 'none' }}>
                    <div className="card" style={{ height: '100%' }}>
                      {/* Cover image or theme-coloured placeholder */}
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
                        {p.status === 'ongoing' && showLiveBadge && <LiveBadge variant="live" />}
                      </div>

                      <div className="card__body">
                        {themes.length > 0 && (
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
              })}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 8, marginTop: 48 }}>
              {currentPage > 1 && (
                <PaginationLink page={currentPage - 1} sp={sp} label="← Previous" />
              )}

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => {
                const isActive = n === currentPage
                return (
                  <PaginationLink
                    key={n}
                    page={n}
                    sp={sp}
                    label={String(n)}
                    active={isActive}
                  />
                )
              })}

              {currentPage < totalPages && (
                <PaginationLink page={currentPage + 1} sp={sp} label="Next →" />
              )}
            </div>
          )}
        </div>
      </section>
    </>
  )
}

// ── Pagination link helper ─────────────────────────────────────────────────────

function PaginationLink({
  page,
  sp,
  label,
  active,
}: {
  page: number
  sp: Record<string, string | string[] | undefined>
  label: string
  active?: boolean
}) {
  const params = new URLSearchParams()
  if (sp.status) params.set('status', sp.status as string)
  if (sp.theme)  params.set('theme',  sp.theme  as string)
  if (sp.q)      params.set('q',      sp.q      as string)
  if (page > 1)  params.set('page',   String(page))

  const href = `/projects${params.toString() ? `?${params.toString()}` : ''}`

  return (
    <Link
      href={href}
      style={{
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        minWidth: 36, height: 36, padding: '0 10px',
        borderRadius: 8, fontSize: 14, fontWeight: active ? 600 : 400,
        textDecoration: 'none',
        background: active ? 'var(--color-primary)' : 'white',
        color: active ? 'white' : 'var(--color-text)',
        border: `1px solid ${active ? 'var(--color-primary)' : 'var(--color-border)'}`,
        boxShadow: active ? '0 2px 8px rgba(61,55,133,0.25)' : 'none',
        transition: 'all 0.15s',
      }}
    >
      {label}
    </Link>
  )
}
