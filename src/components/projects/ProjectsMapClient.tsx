'use client'

import dynamic from 'next/dynamic'

const ProjectsMapInner = dynamic(() => import('./ProjectsMap').then(m => m.ProjectsMap), { ssr: false })

interface Props {
  activeCountries: string[]
  mapPoints: { city: string; country: string; lat: number; lng: number; description?: string | null; type?: string | null }[]
  activeCountryColor?: string
  pinColor?: string
}

export function ProjectsMapClient(props: Props) {
  return <ProjectsMapInner {...props} />
}
