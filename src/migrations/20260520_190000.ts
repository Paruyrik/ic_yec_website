import type { MigrateUpArgs, MigrateDownArgs } from '@payloadcms/db-postgres'

// These match the hardcoded DEFAULT_CITIES in HomeMap.tsx
const SEED_CITIES = [
  { city: 'Yerevan',     country: 'Armenia',        lat: 40.18, lng: 44.51,  isHome: true  },
  { city: 'Berlin',      country: 'Germany',        lat: 52.52, lng: 13.40,  isHome: false },
  { city: 'Paris',       country: 'France',         lat: 48.85, lng: 2.35,   isHome: false },
  { city: 'Warsaw',      country: 'Poland',         lat: 52.23, lng: 21.01,  isHome: false },
  { city: 'Rome',        country: 'Italy',          lat: 41.90, lng: 12.50,  isHome: false },
  { city: 'Lisbon',      country: 'Portugal',       lat: 38.72, lng: -9.14,  isHome: false },
  { city: 'Amsterdam',   country: 'Netherlands',    lat: 52.37, lng: 4.90,   isHome: false },
  { city: 'Bucharest',   country: 'Romania',        lat: 44.43, lng: 26.10,  isHome: false },
  { city: 'Athens',      country: 'Greece',         lat: 37.97, lng: 23.73,  isHome: false },
  { city: 'Prague',      country: 'Czech Republic', lat: 50.08, lng: 14.44,  isHome: false },
  { city: 'Tbilisi',     country: 'Georgia',        lat: 41.69, lng: 44.83,  isHome: false },
  { city: 'Madrid',      country: 'Spain',          lat: 40.42, lng: -3.70,  isHome: false },
  { city: 'Brussels',    country: 'Belgium',        lat: 50.85, lng: 4.35,   isHome: false },
]

export async function up({ payload }: MigrateUpArgs): Promise<void> {
  const settings = await payload.findGlobal({ slug: 'site-settings' as any })
  const existingCities = (settings as any)?.mapConfig?.cities ?? []

  // Only seed if no cities have been configured yet
  if (existingCities.length > 0) return

  const existingMapConfig = (settings as any)?.mapConfig ?? {}

  await payload.updateGlobal({
    slug: 'site-settings' as any,
    data: {
      mapConfig: {
        ...existingMapConfig,
        cities: SEED_CITIES,
      },
    } as any,
  })
}

export async function down({ payload }: MigrateDownArgs): Promise<void> {
  // Clear the seeded cities — safe because down only runs on explicit rollback
  const settings = await payload.findGlobal({ slug: 'site-settings' as any })
  const existingMapConfig = (settings as any)?.mapConfig ?? {}

  await payload.updateGlobal({
    slug: 'site-settings' as any,
    data: {
      mapConfig: {
        ...existingMapConfig,
        cities: [],
      },
    } as any,
  })
}
