'use client'

import { useState } from 'react'
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
  ZoomableGroup,
} from 'react-simple-maps'

const GEO_URL = 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json'

type MapPoint = {
  city: string
  country: string
  lat: number
  lng: number
  description?: string | null
  type?: string | null
}

type Tooltip = { x: number; y: number; content: string } | null

type Props = {
  activeCountries: string[]   // country names that have projects
  mapPoints: MapPoint[]
  activeCountryColor?: string
  pinColor?: string
}

// Simple country-name → ISO numeric lookup for the most common ones IC-YEC works with.
// react-simple-maps uses ISO numeric codes in the 110m topology.
const COUNTRY_ISO: Record<string, string> = {
  'Armenia': '051',
  'Germany': '276',
  'France': '250',
  'Italy': '380',
  'Spain': '724',
  'Poland': '616',
  'Portugal': '620',
  'Netherlands': '528',
  'Belgium': '056',
  'Romania': '642',
  'Greece': '300',
  'Czechia': '203',
  'Czech Republic': '203',
  'Georgia': '268',
  'Azerbaijan': '031',
  'Austria': '040',
  'Hungary': '348',
  'Bulgaria': '100',
  'Croatia': '191',
  'Slovenia': '705',
  'Slovakia': '703',
  'Lithuania': '440',
  'Latvia': '428',
  'Estonia': '233',
  'Finland': '246',
  'Sweden': '752',
  'Norway': '578',
  'Denmark': '208',
  'Switzerland': '756',
  'Turkey': '792',
  'Ukraine': '804',
  'Serbia': '688',
  'Bosnia': '070',
  'Albania': '008',
  'North Macedonia': '807',
  'Kosovo': '412',
  'Moldova': '498',
}

const PIN_ICONS: Record<string, string> = {
  'main-venue':      '★',
  'partner-org':     '◆',
  'event-location':  '●',
}

export function ProjectsMap({ activeCountries, mapPoints, activeCountryColor = '#3D3785', pinColor = '#E8A0A0' }: Props) {
  const [tooltip, setTooltip] = useState<Tooltip>(null)

  const activeISO = new Set(
    activeCountries.flatMap((c) => COUNTRY_ISO[c] ? [COUNTRY_ISO[c]] : [])
  )

  return (
    <div style={{ position: 'relative', background: '#F0EFF8', borderRadius: 16, overflow: 'hidden' }}>
      <ComposableMap
        projectionConfig={{ scale: 147, center: [20, 30] }}
        style={{ width: '100%', height: 'auto' }}
      >
        <ZoomableGroup>
          <Geographies geography={GEO_URL}>
            {({ geographies }) =>
              geographies.map((geo) => {
                const isActive = activeISO.has(geo.id as string)
                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    fill={isActive ? activeCountryColor : '#D9D7FB'}
                    stroke="#fff"
                    strokeWidth={0.5}
                    style={{
                      default: { outline: 'none', opacity: isActive ? 1 : 0.5 },
                      hover:   { outline: 'none', fill: isActive ? activeCountryColor : '#C5C3F0', opacity: 1 },
                      pressed: { outline: 'none' },
                    }}
                  />
                )
              })
            }
          </Geographies>

          {mapPoints.map((point, i) => (
            <Marker
              key={i}
              coordinates={[point.lng, point.lat]}
              onMouseEnter={(e) => {
                const rect = (e.target as SVGElement).closest('svg')?.getBoundingClientRect()
                if (!rect) return
                setTooltip({
                  x: e.clientX - rect.left,
                  y: e.clientY - rect.top - 10,
                  content: `${point.city}${point.description ? ` - ${point.description}` : ''}`,
                })
              }}
              onMouseLeave={() => setTooltip(null)}
              style={{ cursor: 'pointer' }}
            >
              <circle r={6} fill={pinColor} stroke="#fff" strokeWidth={1.5} />
              <text
                textAnchor="middle"
                y={-10}
                style={{ fontSize: 8, fill: '#1A1833', fontFamily: 'system-ui', pointerEvents: 'none' }}
              >
                {PIN_ICONS[point.type ?? 'event-location'] ?? '●'}
              </text>
            </Marker>
          ))}
        </ZoomableGroup>
      </ComposableMap>

      {/* Tooltip */}
      {tooltip && (
        <div
          style={{
            position: 'absolute',
            left: tooltip.x + 12,
            top: tooltip.y,
            background: '#1A1833',
            color: 'white',
            padding: '6px 10px',
            borderRadius: 6,
            fontSize: 12,
            pointerEvents: 'none',
            whiteSpace: 'nowrap',
            zIndex: 10,
          }}
        >
          {tooltip.content}
        </div>
      )}

      {/* Legend */}
      <div style={{
        position: 'absolute', bottom: 14, right: 14,
        background: 'rgba(255,255,255,0.9)', borderRadius: 8, padding: '8px 12px',
        fontSize: 11, display: 'flex', flexDirection: 'column', gap: 4,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ width: 12, height: 12, borderRadius: 2, background: activeCountryColor, display: 'inline-block' }} />
          Countries with projects
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ width: 10, height: 10, borderRadius: '50%', background: pinColor, display: 'inline-block' }} />
          Project locations
        </div>
      </div>
    </div>
  )
}
