'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
} from 'react-simple-maps'
import { countryToISO } from '@/lib/countryIso'

const GEO_URL = 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json'

// Fallback when no cities are configured in the CMS: show only the IC-YEC HQ
// (always real). Every other city must be added in Site Settings → Interactive
// Map to appear, so the map always reflects real CMS data.
const HQ_FALLBACK: MapCity[] = [
  { city: 'Yerevan', country: 'Armenia', lat: 40.18, lng: 44.51, isHome: true },
]

export interface MapCity {
  city: string
  country: string
  lat: number
  lng: number
  isHome?: boolean
}

export interface ProjectPoint {
  title: string
  slug: string
  city: string
  country: string
  lat: number
  lng: number
  type?: string | null
  description?: string | null
}

export interface HomeMapProps {
  activeCountries?: string[]
  cities?: MapCity[]
  activeCountryColor?: string
  homeCityColor?: string
  partnerCityColor?: string
  // Enhanced (opt-in) behaviour
  inactiveColor?: string
  backgroundColor?: string
  legend?: { active?: string; home?: string; city?: string }
  countryCounts?: Record<string, number>
  projectPoints?: ProjectPoint[]
  enableCountryLinks?: boolean
}

type Tooltip = { x: number; y: number; w: number; content: string } | null
type ProjectRef = { title: string; slug: string }
type PointGroup = { lat: number; lng: number; city: string; country: string; projects: ProjectRef[] }
type Popup = { x: number; y: number; w: number; group: PointGroup } | null

const PROJECT_PIN_COLOR = '#F4B740'

export function HomeMap({
  activeCountries = [],
  cities,
  activeCountryColor = '#3D3785',
  homeCityColor = '#E8A0A0',
  partnerCityColor = '#8B85E8',
  inactiveColor = '#1e1d3a',
  backgroundColor = '#0f0e1a',
  legend,
  countryCounts,
  projectPoints = [],
  enableCountryLinks = false,
}: HomeMapProps) {
  const router = useRouter()
  const [tooltip, setTooltip] = useState<Tooltip>(null)
  const [hoveredCity, setHoveredCity] = useState<string | null>(null)
  const [popup, setPopup] = useState<Popup>(null)

  const displayCities = cities && cities.length > 0 ? cities : HQ_FALLBACK

  // Highlight countries strictly from the real partner-country list. A city
  // dot must NOT force its whole country to light up (that previously caused
  // default-city countries like Germany/Belgium/Netherlands/Portugal/Czechia
  // to appear active even when no project listed them).
  const allActiveCountries = activeCountries

  // ISO-keyed lookups so matching is robust regardless of name spelling.
  const activeISO = new Set<string>()
  const countByISO: Record<string, number> = {}
  const nameByISO: Record<string, string> = {}
  for (const name of allActiveCountries) {
    const iso = countryToISO(name)
    if (!iso) continue
    activeISO.add(iso)
    if (!nameByISO[iso]) nameByISO[iso] = name
    if (countryCounts && countryCounts[name]) countByISO[iso] = (countByISO[iso] ?? 0) + countryCounts[name]
  }

  const activeHighlight = activeCountryColor + 'cc'
  const activeHover = activeCountryColor

  // Deduplicate project pins by coordinate so multiple projects at the same
  // venue (e.g. several exchanges in one city) collapse into a single pin.
  const pointGroups: PointGroup[] = (() => {
    const m = new Map<string, PointGroup>()
    for (const p of projectPoints) {
      const key = `${p.lat.toFixed(4)},${p.lng.toFixed(4)}`
      const g = m.get(key)
      if (g) g.projects.push({ title: p.title, slug: p.slug })
      else m.set(key, { lat: p.lat, lng: p.lng, city: p.city, country: p.country, projects: [{ title: p.title, slug: p.slug }] })
    }
    return [...m.values()]
  })()

  function svgPos(e: React.MouseEvent) {
    const svg = (e.target as SVGElement).closest('svg')
    const rect = svg?.getBoundingClientRect()
    if (!rect) return null
    return { x: e.clientX - rect.left, y: e.clientY - rect.top, w: rect.width }
  }

  function onCountryEnter(e: React.MouseEvent, iso: string, geoName: string) {
    if (!activeISO.has(iso)) return
    const pos = svgPos(e)
    if (!pos) return
    const count = countByISO[iso]
    const label = nameByISO[iso] ?? geoName
    setTooltip({ x: pos.x, y: pos.y - 12, w: pos.w, content: count ? `${label} — ${count} project${count !== 1 ? 's' : ''}` : label })
  }

  function onCountryClick(iso: string) {
    if (!enableCountryLinks || !activeISO.has(iso)) return
    const name = nameByISO[iso]
    if (name) router.push(`/projects?country=${encodeURIComponent(name)}#projects-grid`)
  }

  const renderMarkers = () => (
    <>
      {displayCities.map((city) => {
        const isHovered = hoveredCity === city.city
        const dotColor = city.isHome ? homeCityColor : partnerCityColor
        const ringAnim = city.isHome ? 'homePulseHome' : 'homePulseRing'
        const dotRadius = city.isHome ? 5 : 3.5
        const ringStart = city.isHome ? 8 : 6
        return (
          <Marker
            key={`city-${city.city}`}
            coordinates={[city.lng, city.lat]}
            onMouseEnter={(e: React.MouseEvent) => {
              const pos = svgPos(e)
              if (pos) setTooltip({ x: pos.x, y: pos.y - 12, w: pos.w, content: `${city.city}, ${city.country}` })
              setHoveredCity(city.city)
            }}
            onMouseLeave={() => { setTooltip(null); setHoveredCity(null) }}
            style={{ cursor: 'pointer' }}
          >
            <circle r={ringStart} fill={dotColor} opacity={0} style={{ animation: `${ringAnim} 2.4s ease-out infinite` }} />
            <circle r={dotRadius} fill={dotColor} stroke={city.isHome ? '#fff' : activeCountryColor} strokeWidth={city.isHome ? 1.5 : 1} style={{ transition: 'r 0.2s' }} />
            {(city.isHome || isHovered) && (
              <text textAnchor="middle" y={city.isHome ? -10 : -8} style={{
                fontSize: city.isHome ? 9 : 7.5,
                fill: city.isHome ? homeCityColor : 'rgba(255,255,255,0.8)',
                fontFamily: 'system-ui', pointerEvents: 'none', fontWeight: city.isHome ? 600 : 400,
              }}>
                {city.isHome ? '★ ' : ''}{city.city}
              </text>
            )}
          </Marker>
        )
      })}

      {pointGroups.map((g, i) => {
        const n = g.projects.length
        return (
          <Marker
            key={`grp-${g.lat},${g.lng}-${i}`}
            coordinates={[g.lng, g.lat]}
            onMouseEnter={(e: React.MouseEvent) => {
              const pos = svgPos(e)
              if (pos) setTooltip({ x: pos.x, y: pos.y - 12, w: pos.w, content: n === 1 ? `${g.projects[0].title} — ${g.city}` : `${g.city} — ${n} projects` })
            }}
            onMouseLeave={() => setTooltip(null)}
            onClick={(e: React.MouseEvent) => {
              const pos = svgPos(e)
              if (pos) setPopup({ x: pos.x, y: pos.y, w: pos.w, group: g })
              setTooltip(null)
            }}
            style={{ cursor: 'pointer' }}
          >
            {n > 1 ? (
              <>
                <circle r={7} fill={PROJECT_PIN_COLOR} stroke="#0f0e1a" strokeWidth={1.2} />
                <text textAnchor="middle" dominantBaseline="central" style={{ fontSize: 8, fontWeight: 700, fill: '#0f0e1a', pointerEvents: 'none' }}>{n}</text>
              </>
            ) : (
              <>
                <circle r={4.5} fill={PROJECT_PIN_COLOR} stroke="#0f0e1a" strokeWidth={1.2} />
                <circle r={1.6} fill="#0f0e1a" />
              </>
            )}
          </Marker>
        )
      })}
    </>
  )

  const geographies = (
    <Geographies geography={GEO_URL}>
      {({ geographies }) =>
        geographies.map((geo) => {
          const iso = geo.id as string
          const isActive = activeISO.has(iso)
          const clickable = isActive && enableCountryLinks
          return (
            <Geography
              key={geo.rsmKey}
              geography={geo}
              fill={isActive ? activeHighlight : inactiveColor}
              stroke={backgroundColor}
              strokeWidth={0.6}
              onMouseEnter={(e: React.MouseEvent) => onCountryEnter(e, iso, geo.properties?.name)}
              onMouseMove={(e: React.MouseEvent) => onCountryEnter(e, iso, geo.properties?.name)}
              onMouseLeave={() => setTooltip(null)}
              onClick={() => onCountryClick(iso)}
              style={{
                default: { outline: 'none', opacity: isActive ? 1 : 0.7, cursor: clickable ? 'pointer' : 'default' },
                hover: { outline: 'none', fill: isActive ? activeHover : '#2d2b52', opacity: 1, cursor: clickable ? 'pointer' : 'default' },
                pressed: { outline: 'none' },
              }}
            />
          )
        })
      }
    </Geographies>
  )

  return (
    <div style={{ position: 'relative', borderRadius: 20, overflow: 'hidden', background: backgroundColor }}>
      <style>{`
        @keyframes homePulseRing { 0% { r: 6; opacity: 0.6; } 70% { r: 16; opacity: 0; } 100% { r: 16; opacity: 0; } }
        @keyframes homePulseHome { 0% { r: 8; opacity: 0.7; } 70% { r: 22; opacity: 0; } 100% { r: 22; opacity: 0; } }
      `}</style>

      <ComposableMap projectionConfig={{ scale: 680, center: [22, 51] }} style={{ width: '100%', height: 'auto' }}>
        {geographies}
        {renderMarkers()}
      </ComposableMap>

      {tooltip && (
        <div style={{
          position: 'absolute', top: tooltip.y,
          // Flip to the left of the cursor near the right edge so it never clips.
          ...(tooltip.x > tooltip.w * 0.6
            ? { right: tooltip.w - tooltip.x + 14 }
            : { left: tooltip.x + 14 }),
          background: 'rgba(255,255,255,0.95)', color: '#1A1833',
          padding: '5px 10px', borderRadius: 7, fontSize: 12, fontWeight: 500,
          pointerEvents: 'none', maxWidth: 220, boxShadow: '0 2px 10px rgba(0,0,0,0.2)', zIndex: 10,
        }}>
          {tooltip.content}
        </div>
      )}

      {/* Project point popup */}
      {popup && (
        <div style={{
          position: 'absolute', top: Math.max(popup.y - 10, 8),
          ...(popup.x > popup.w * 0.55
            ? { right: popup.w - popup.x + 14 }
            : { left: popup.x + 14 }),
          background: 'white', color: '#1A1833', borderRadius: 10, padding: '14px 16px',
          width: 230, boxShadow: '0 6px 24px rgba(0,0,0,0.28)', zIndex: 20,
        }}>
          <button
            onClick={() => setPopup(null)}
            aria-label="Close"
            style={{ position: 'absolute', top: 6, right: 8, border: 'none', background: 'none', cursor: 'pointer', fontSize: 16, color: 'var(--color-text-muted)' }}
          >×</button>
          <div style={{ fontSize: 11, color: 'var(--color-text-muted)', marginBottom: popup.group.projects.length > 1 ? 8 : 4, paddingRight: 12 }}>
            📍 {popup.group.city}, {popup.group.country}
            {popup.group.projects.length > 1 && ` · ${popup.group.projects.length} projects`}
          </div>
          {popup.group.projects.length === 1 ? (
            <>
              <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 10, paddingRight: 12 }}>
                {popup.group.projects[0].title}
              </div>
              <a href={`/projects/${popup.group.projects[0].slug}`} style={{ fontSize: 13, fontWeight: 500, color: 'var(--color-primary)', textDecoration: 'none' }}>
                View project →
              </a>
            </>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 7, maxHeight: 220, overflowY: 'auto' }}>
              {popup.group.projects.map((pr) => (
                <a key={pr.slug} href={`/projects/${pr.slug}`} style={{ fontSize: 13, color: 'var(--color-primary)', textDecoration: 'none', lineHeight: 1.35 }}>
                  • {pr.title}
                </a>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Legend */}
      <div style={{
        position: 'absolute', bottom: 16, left: 16,
        display: 'flex', flexDirection: 'column', gap: 6,
        background: 'rgba(15,14,26,0.75)', backdropFilter: 'blur(6px)',
        borderRadius: 10, padding: '10px 14px', fontSize: 11,
        color: 'rgba(255,255,255,0.7)', border: '1px solid rgba(255,255,255,0.08)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
          <span style={{ width: 10, height: 10, borderRadius: 2, background: activeCountryColor, display: 'inline-block' }} />
          {legend?.active ?? 'Partner countries'}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: homeCityColor, display: 'inline-block' }} />
          {legend?.home ?? 'IC-YEC headquarters'}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
          <span style={{ width: 7, height: 7, borderRadius: '50%', background: partnerCityColor, display: 'inline-block' }} />
          {legend?.city ?? 'Partner cities'}
        </div>
        {projectPoints.length > 0 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: PROJECT_PIN_COLOR, display: 'inline-block' }} />
            Project locations
          </div>
        )}
      </div>
    </div>
  )
}
