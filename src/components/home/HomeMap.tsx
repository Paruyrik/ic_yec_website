'use client'

import { useState } from 'react'
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
} from 'react-simple-maps'

const GEO_URL = 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json'

const COUNTRY_ISO: Record<string, string> = {
  'Armenia':        '051',
  'Germany':        '276',
  'France':         '250',
  'Italy':          '380',
  'Spain':          '724',
  'Poland':         '616',
  'Portugal':       '620',
  'Netherlands':    '528',
  'Belgium':        '056',
  'Romania':        '642',
  'Greece':         '300',
  'Czechia':        '203',
  'Czech Republic': '203',
  'Georgia':        '268',
  'Azerbaijan':     '031',
  'Austria':        '040',
  'Hungary':        '348',
  'Bulgaria':       '100',
  'Croatia':        '191',
  'Slovenia':       '705',
  'Slovakia':       '703',
  'Lithuania':      '440',
  'Latvia':         '428',
  'Estonia':        '233',
  'Finland':        '246',
  'Sweden':         '752',
  'Norway':         '578',
  'Denmark':        '208',
  'Switzerland':    '756',
  'Turkey':         '792',
  'Ukraine':        '804',
  'Serbia':         '688',
  'Moldova':        '498',
  'Bosnia':         '070',
  'Albania':        '008',
  'North Macedonia':'807',
}

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

interface Props {
  activeCountries?: string[]
  cities?: MapCity[]
  activeCountryColor?: string
  homeCityColor?: string
  partnerCityColor?: string
}

type Tooltip = { x: number; y: number; content: string } | null

export function HomeMap({
  activeCountries = [],
  cities,
  activeCountryColor = '#3D3785',
  homeCityColor = '#E8A0A0',
  partnerCityColor = '#8B85E8',
}: Props) {
  const [tooltip, setTooltip] = useState<Tooltip>(null)
  const [hoveredCity, setHoveredCity] = useState<string | null>(null)

  const displayCities = cities && cities.length > 0 ? cities : DEFAULT_CITIES

  const allActiveCountries = new Set([
    ...activeCountries,
    ...displayCities.map(c => c.country),
  ])

  const activeISO = new Set(
    [...allActiveCountries].flatMap(c => COUNTRY_ISO[c] ? [COUNTRY_ISO[c]] : [])
  )

  const activeHighlight = activeCountryColor + 'cc'
  const activeHover     = activeCountryColor

  return (
    <div style={{ position: 'relative', borderRadius: 20, overflow: 'hidden', background: '#0f0e1a' }}>

      <style>{`
        @keyframes homePulseRing {
          0%   { r: 6;  opacity: 0.6; }
          70%  { r: 16; opacity: 0; }
          100% { r: 16; opacity: 0; }
        }
        @keyframes homePulseHome {
          0%   { r: 8;  opacity: 0.7; }
          70%  { r: 22; opacity: 0; }
          100% { r: 22; opacity: 0; }
        }
      `}</style>

      <ComposableMap
        projectionConfig={{ scale: 680, center: [22, 51] }}
        style={{ width: '100%', height: 'auto' }}
      >
        <Geographies geography={GEO_URL}>
          {({ geographies }) =>
            geographies.map((geo) => {
              const isActive = activeISO.has(geo.id as string)
              return (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  fill={isActive ? activeHighlight : '#1e1d3a'}
                  stroke="#0f0e1a"
                  strokeWidth={0.6}
                  style={{
                    default: { outline: 'none', opacity: isActive ? 1 : 0.7 },
                    hover:   { outline: 'none', fill: isActive ? activeHover : '#2d2b52', opacity: 1 },
                    pressed: { outline: 'none' },
                  }}
                />
              )
            })
          }
        </Geographies>

        {displayCities.map((city) => {
          const isHovered = hoveredCity === city.city
          const dotColor  = city.isHome ? homeCityColor : partnerCityColor
          const ringAnim  = city.isHome ? 'homePulseHome' : 'homePulseRing'
          const dotRadius = city.isHome ? 5 : 3.5
          const ringStart = city.isHome ? 8 : 6

          return (
            <Marker
              key={city.city}
              coordinates={[city.lng, city.lat]}
              onMouseEnter={(e: React.MouseEvent) => {
                const svg = (e.target as SVGElement).closest('svg')
                const rect = svg?.getBoundingClientRect()
                if (rect) {
                  setTooltip({ x: e.clientX - rect.left, y: e.clientY - rect.top - 12, content: `${city.city}, ${city.country}` })
                }
                setHoveredCity(city.city)
              }}
              onMouseLeave={() => { setTooltip(null); setHoveredCity(null) }}
              style={{ cursor: 'pointer' }}
            >
              <circle
                r={ringStart}
                fill={dotColor}
                opacity={0}
                style={{ animation: `${ringAnim} 2.4s ease-out infinite` }}
              />
              <circle
                r={dotRadius}
                fill={dotColor}
                stroke={city.isHome ? '#fff' : activeCountryColor}
                strokeWidth={city.isHome ? 1.5 : 1}
                style={{ transition: 'r 0.2s' }}
              />
              {(city.isHome || isHovered) && (
                <text
                  textAnchor="middle"
                  y={city.isHome ? -10 : -8}
                  style={{
                    fontSize: city.isHome ? 9 : 7.5,
                    fill: city.isHome ? homeCityColor : 'rgba(255,255,255,0.8)',
                    fontFamily: 'system-ui',
                    pointerEvents: 'none',
                    fontWeight: city.isHome ? 600 : 400,
                  }}
                >
                  {city.isHome ? '★ ' : ''}{city.city}
                </text>
              )}
            </Marker>
          )
        })}
      </ComposableMap>

      {tooltip && (
        <div style={{
          position: 'absolute',
          left: tooltip.x + 14,
          top: tooltip.y,
          background: 'rgba(255,255,255,0.95)',
          color: '#1A1833',
          padding: '5px 10px',
          borderRadius: 7,
          fontSize: 12,
          fontWeight: 500,
          pointerEvents: 'none',
          whiteSpace: 'nowrap',
          boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
          zIndex: 10,
        }}>
          {tooltip.content}
        </div>
      )}

      <div style={{
        position: 'absolute', bottom: 16, left: 16,
        display: 'flex', flexDirection: 'column', gap: 6,
        background: 'rgba(15,14,26,0.75)',
        backdropFilter: 'blur(6px)',
        borderRadius: 10,
        padding: '10px 14px',
        fontSize: 11,
        color: 'rgba(255,255,255,0.7)',
        border: '1px solid rgba(255,255,255,0.08)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
          <span style={{ width: 10, height: 10, borderRadius: 2, background: activeCountryColor, display: 'inline-block' }} />
          Partner countries
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: homeCityColor, display: 'inline-block' }} />
          IC-YEC headquarters
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
          <span style={{ width: 7, height: 7, borderRadius: '50%', background: partnerCityColor, display: 'inline-block' }} />
          Partner cities
        </div>
      </div>
    </div>
  )
}
