'use client'

import dynamic from 'next/dynamic'
import type { MapCity } from './HomeMap'

const HomeMapInner = dynamic(() => import('./HomeMap').then(m => m.HomeMap), { ssr: false })

interface Props {
  activeCountries?: string[]
  cities?: MapCity[]
  activeCountryColor?: string
  homeCityColor?: string
  partnerCityColor?: string
}

export function HomeMapClient(props: Props) {
  return <HomeMapInner {...props} />
}
