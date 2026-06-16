import Link from 'next/link'
import { Suspense } from 'react'
import type { Project } from '@/payload-types'
import { getPayloadClient } from '@/lib/payloadClient'
import { buildProjectWhere } from '@/lib/projects'
import { HomeMapClient as ProjectsMap } from '@/components/home/HomeMapClient'
import { ThemeImpactGrid } from '@/components/projects/ThemeImpactGrid'
import { ProjectsFilterBar } from '@/components/projects/ProjectsFilterBar'
import { ProjectsGrid } from '@/components/projects/ProjectsGrid'

// ── helpers ────────────────────────────────────────────────────────────────────

function localStr(val: unknown): string {
  if (!val) return ''
  if (typeof val === 'string') return val
  return (val as any)?.en ?? ''
}

const LIMIT = 12

// ── page ──────────────────────────────────────────────────────────────────────

export default async function ProjectsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const sp = await searchParams
  const currentStatus  = (sp.status  as string) ?? ''
  const currentTheme   = (sp.theme   as string) ?? ''
  const currentRole    = (sp.role    as string) ?? ''
  const currentQ       = (sp.q       as string) ?? ''
  const currentCountry = (sp.country as string) ?? ''

  const payload = await getPayloadClient()

  // ── build where clause for filtered query ──────────────────────────────────
  const where = buildProjectWhere({
    status:  currentStatus  || undefined,
    theme:   currentTheme   || undefined,
    role:    currentRole    || undefined,
    q:       currentQ       || undefined,
    country: currentCountry || undefined,
  })

  const hasFilter = currentStatus || currentTheme || currentRole || currentQ || currentCountry

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
      sort: 'order',
      depth: 1,
    }).catch(() => ({ docs: [] as Project[] })),

    payload.getCachedGlobal({ slug: 'projects-settings' as any }).catch(() => null),
    payload.getCachedGlobal({ slug: 'site-settings' as any }).catch(() => null),

    // Filtered + paginated: for the grid
    payload.getCachedCollection<'projects'>({
      collection: 'projects',
      limit: LIMIT,
      page: 1,
      sort: 'order',
      depth: 1,
      ...(where ? { where } : {}),
    }).catch(() => ({ docs: [] as Project[], totalDocs: 0, totalPages: 1 })),
  ])

  const ss = siteSettings as any

  // ── derive map data from ALL projects ─────────────────────────────────────
  const allCountries = Array.from(
    new Set(allProjects.flatMap((p) => (p.countries ?? []).map((c: any) => c.country).filter(Boolean)))
  ) as string[]

  // Projects per country (for the hover tooltip count)
  const countryCounts: Record<string, number> = {}
  for (const p of allProjects) {
    for (const c of (p.countries ?? []) as any[]) {
      if (c.country) countryCounts[c.country] = (countryCounts[c.country] ?? 0) + 1
    }
  }

  // Each project's specific map locations → clickable pins
  const projectPoints = allProjects.flatMap((p: any) =>
    (p.mapPoints ?? [])
      .filter((mp: any) => typeof mp.lat === 'number' && typeof mp.lng === 'number')
      .map((mp: any) => ({
        title: localStr(p.title) || 'Project',
        slug: p.slug as string,
        city: mp.city as string,
        country: mp.country as string,
        lat: mp.lat as number,
        lng: mp.lng as number,
        type: mp.type ?? null,
        description: mp.description ?? null,
      }))
  )

  const mapEnabled   = (settings as any)?.mapSection?.enabled !== false
  const mapTitle     = localStr((settings as any)?.mapSection?.title) || 'Where we work'
  const mapSubtitle  = localStr((settings as any)?.mapSection?.subtitle)
  const stats: any[] = (settings as any)?.impactStats?.stats ?? []

  const mapCfg             = ss?.mapConfig ?? {}
  const activeCountryColor = mapCfg.activeCountryColor  || '#3D3785'
  const homeCityColor      = mapCfg.homeCityColor        || '#E8A0A0'
  const partnerCityColor   = mapCfg.partnerCityColor     || '#8B85E8'
  const inactiveColor      = mapCfg.inactiveCountryColor || '#1e1d3a'
  const mapBackground      = mapCfg.backgroundColor      || '#0f0e1a'
  const mapLegend          = {
    active: localStr(mapCfg.legendActiveLabel) || 'Partner countries',
    home:   localStr(mapCfg.legendHomeLabel)   || 'IC-YEC headquarters',
    city:   localStr(mapCfg.legendCityLabel)   || 'Partner cities',
  }
  const configuredCities   = (mapCfg.cities ?? []) as { city: string; country: string; lat: number; lng: number; isHome?: boolean }[]

  const autoStats = stats.length ? stats : [
    { icon: '📋', value: String(allProjects.length),       label: 'Projects' },
    { icon: '🌍', value: String(allCountries.length),      label: 'Countries reached' },
    { icon: '👥', value: String(allProjects.reduce((s, p: any) => s + (p.participants ?? 0), 0) || '-'), label: 'Participants' },
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
              inactiveColor={inactiveColor}
              backgroundColor={mapBackground}
              legend={mapLegend}
              countryCounts={countryCounts}
              projectPoints={projectPoints}
              enableCountryLinks
              zoomable
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
      <section id="projects-grid" className="section section--tint">
        <div className="container">
          <div style={{ marginBottom: 24 }}>
            <h2 style={{ fontSize: 26, marginBottom: 20 }}>All Projects</h2>

            {/* Filter bar - wrapped in Suspense because it uses useSearchParams */}
            <Suspense fallback={
              <div style={{ height: 42, background: 'rgba(255,255,255,0.5)', borderRadius: 8, animation: 'pulse 1.5s infinite' }} />
            }>
              <ProjectsFilterBar
                total={totalDocs}
                currentStatus={currentStatus}
                currentTheme={currentTheme}
                currentRole={currentRole}
                currentQ={currentQ}
                currentCountry={currentCountry}
              />
            </Suspense>
          </div>

          <ProjectsGrid
            initialProjects={projects}
            initialTotalPages={totalPages}
            filters={{
              status:  currentStatus  || undefined,
              theme:   currentTheme   || undefined,
              role:    currentRole    || undefined,
              q:       currentQ       || undefined,
              country: currentCountry || undefined,
            }}
            hasFilter={Boolean(hasFilter)}
          />
        </div>
      </section>
    </>
  )
}
