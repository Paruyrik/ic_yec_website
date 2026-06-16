'use client'

import dynamic from 'next/dynamic'
import type { HomeMapProps } from './HomeMap'

const HomeMapInner = dynamic(() => import('./HomeMap').then(m => m.HomeMap), { ssr: false })

export function HomeMapClient(props: HomeMapProps) {
  return <HomeMapInner {...props} />
}
