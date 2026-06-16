'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
  ZoomableGroup,
} from 'react-simple-maps'
import { countryToISO } from '@/lib/countryIso'

const GEO_URL = 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json'

const DEFAULT_CITIES: MapCity[] = [
  { city: 'Yerevan',     country: 'Armenia',       lat: 40.18, lng: 44.51,  isHome: true  },
  { city: 'Berlin',      country: 'Germany',       lat: 52.52, lng: 13.40,  isHome: false },
  { city: 'Paris',       country: 'France',        lat: 48.85, lng: 2.35,   isHome: false },
  { city: 'Warsaw',      country: 'Poland',        lat: 52.23, lng: 21.01,  isHome: false },
  { city: 'Rome',        country: 'Italy',         lat: 41.90, lng: 12.50,  isHome: false },
  { city: 'Lisbon',      country: 'Portugal',      lat: 38.72, lng: -9.14,  isHome: false },
  { city: 'Amsterdam',   country: 'Netherlands',   lat: 52.37, lng: 4.90,   isHome: false },
  { city: 'Bucharest',   country: 'Romania',       lat: 44.43, lng: 26.10,  isHome: false },
  { city: 'Athens',      country: 'Greece',        lat: 37.97, lng: 23.73,  isHome: false },
  { city: 'Prague',      country: 'Czech Republic',lat: 50.08, lng: 14.44,  isHome: false },
  { city: 'Tbilisi',     country: 'Georgia',       lat: 41.69, lng: 44.83,  isHome: false },
  { city: 'Madrid',      country: 'Spain',         lat: 40.42, lng: -3.70,  isHome: false },
  { city: 'Brussels',    country: 'Belgium',       lat: 50.85, lng: 4.35,   isHome: false },
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
  zoomable?: boolean
}

type Tooltip = { x: number; y: number; content: string } | null
type Popup = { x: number; y: number; point: ProjectPoint } | null

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
  zoomable = false,
}: HomeMapProps) {
  const router = useRouter()
  const [tooltip, setTooltip] = useState<Tooltip>(null)
  const [hoveredCity, setHoveredCity] = useState<string | null>(null)
  const [popup, setPopup] = useState<Popup>(null)
  const [zoom, setZoom] = useState(1)

  const displayCities = cities && cities.length > 0 ? cities : DEFAULT_CITIES

  const allActiveCountries = [
    ...activeCountries,
    ...displayCities.map((c) => c.country),
  ]

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

  function svgPos(e: React.MouseEvent) {
    const svg = (e.target as SVGElement).closest('svg')
    const rect = svg?.getBoundingClientRect()
    if (!rect) return null
    return { x: e.clientX - rect.left, y: e.clientY - rect.top }
  }

  function onCountryEnter(e: React.MouseEvent, iso: string, geoName: string) {
    if (!activeISO.has(iso)) return
    const pos = svgPos(e)
    if (!pos) return
    const count = countByISO[iso]
    const label = nameByISO[iso] ?? geoName
    setTooltip({ x: pos.x, y: pos.y - 12, content: count ? `${label} — ${count} project${count !== 1 ? 's' : ''}` : label })
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
              if (pos) setTooltip({ x: pos.x, y: pos.y - 12, content: `${city.city}, ${city.country}` })
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

      {projectPoints.map((p, i) => (
        <Marker
          key={`proj-${p.slug}-${i}`}
          coordinates={[p.lng, p.lat]}
          onMouseEnter={(e: React.MouseEvent) => {
            const pos = svgPos(e)
            if (pos) setTooltip({ x: pos.x, y: pos.y - 12, content: `${p.title} — ${p.city}` })
          }}
          onMouseLeave={() => setTooltip(null)}
          onClick={(e: React.MouseEvent) => {
            const pos = svgPos(e)
            if (pos) setPopup({ x: pos.x, y: pos.y, point: p })
            setTooltip(null)
          }}
          style={{ cursor: 'pointer' }}
        >
          <circle r={4.5} fill={PROJECT_PIN_COLOR} stroke="#0f0e1a" strokeWidth={1.2} />
          <circle r={1.6} fill="#0f0e1a" />
        </Marker>
      ))}
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
        {zoomable ? (
          // v3 runtime supports these props; bundled types are incomplete, hence the cast.
          <ZoomableGroup {...({ zoom, minZoom: 1, maxZoom: 8, onMoveEnd: ({ zoom: z }: { zoom: number }) => setZoom(z) } as any)}>
            {geographies}
            {renderMarkers()}
          </ZoomableGroup>
        ) : (
          <>
            {geographies}
            {renderMarkers()}
          </>
        )}
      </ComposableMap>

      {/* Zoom controls */}
      {zoomable && (
        <div style={{ position: 'absolute', top: 16, right: 16, display: 'flex', flexDirection: 'column', gap: 6 }}>
          <button
            onClick={() => setZoom((z) => Math.min(8, z * 1.5))}
            aria-label="Zoom in"
            style={zoomBtnStyle}
          >+</button>
          <button
            onClick={() => setZoom((z) => Math.max(1, z / 1.5))}
            aria-label="Zoom out"
            style={zoomBtnStyle}
          >−</button>
        </div>
      )}

      {tooltip && (
        <div style={{
          position: 'absolute', left: tooltip.x + 14, top: tooltip.y,
          background: 'rgba(255,255,255,0.95)', color: '#1A1833',
          padding: '5px 10px', borderRadius: 7, fontSize: 12, fontWeight: 500,
          pointerEvents: 'none', whiteSpace: 'nowrap', boxShadow: '0 2px 10px rgba(0,0,0,0.2)', zIndex: 10,
        }}>
          {tooltip.content}
        </div>
      )}

      {/* Project point popup */}
      {popup && (
        <div style={{
          position: 'absolute', left: popup.x + 14, top: Math.max(popup.y - 10, 8),
          background: 'white', color: '#1A1833', borderRadius: 10, padding: '14px 16px',
          width: 230, boxShadow: '0 6px 24px rgba(0,0,0,0.28)', zIndex: 20,
        }}>
          <button
            onClick={() => setPopup(null)}
            aria-label="Close"
            style={{ position: 'absolute', top: 6, right: 8, border: 'none', background: 'none', cursor: 'pointer', fontSize: 16, color: 'var(--color-text-muted)' }}
          >×</button>
          <div style={{ fontSize: 11, color: 'var(--color-text-muted)', marginBottom: 4 }}>
            📍 {popup.point.city}, {popup.point.country}
          </div>
          <div style={{ fontSize: 14, fontWeight: 600, marginBottom: popup.point.description ? 6 : 10, paddingRight: 12 }}>
            {popup.point.title}
          </div>
          {popup.point.description && (
            <p style={{ fontSize: 12, color: 'var(--color-text-muted)', lineHeight: 1.5, marginBottom: 10 }}>{popup.point.description}</p>
          )}
          <a href={`/projects/${popup.point.slug}`} style={{ fontSize: 13, fontWeight: 500, color: 'var(--color-primary)', textDecoration: 'none' }}>
            View project →
          </a>
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

const zoomBtnStyle: React.CSSProperties = {
  width: 32, height: 32, borderRadius: 8, cursor: 'pointer',
  background: 'rgba(15,14,26,0.8)', color: 'white',
  border: '1px solid rgba(255,255,255,0.15)', fontSize: 18, lineHeight: 1,
  display: 'flex', alignItems: 'center', justifyContent: 'center',
}
