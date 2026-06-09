import { MigrateUpArgs, sql } from '@payloadcms/db-postgres'

// These match the hardcoded DEFAULT_CITIES in HomeMap.tsx
const SEED_CITIES = [
  { city: 'Yerevan',   country: 'Armenia',        lat: 40.18, lng: 44.51,  isHome: true  },
  { city: 'Berlin',    country: 'Germany',        lat: 52.52, lng: 13.40,  isHome: false },
  { city: 'Paris',     country: 'France',         lat: 48.85, lng: 2.35,   isHome: false },
  { city: 'Warsaw',    country: 'Poland',         lat: 52.23, lng: 21.01,  isHome: false },
  { city: 'Rome',      country: 'Italy',          lat: 41.90, lng: 12.50,  isHome: false },
  { city: 'Lisbon',    country: 'Portugal',       lat: 38.72, lng: -9.14,  isHome: false },
  { city: 'Amsterdam', country: 'Netherlands',    lat: 52.37, lng: 4.90,   isHome: false },
  { city: 'Bucharest', country: 'Romania',        lat: 44.43, lng: 26.10,  isHome: false },
  { city: 'Athens',    country: 'Greece',         lat: 37.97, lng: 23.73,  isHome: false },
  { city: 'Prague',    country: 'Czech Republic', lat: 50.08, lng: 14.44,  isHome: false },
  { city: 'Tbilisi',   country: 'Georgia',        lat: 41.69, lng: 44.83,  isHome: false },
  { city: 'Madrid',    country: 'Spain',          lat: 40.42, lng: -3.70,  isHome: false },
  { city: 'Brussels',  country: 'Belgium',        lat: 50.85, lng: 4.35,   isHome: false },
]

export async function up({ db }: MigrateUpArgs): Promise<void> {
  // Use raw SQL — avoids Payload API querying tables that don't exist yet
  const existingRows = await db.execute(sql`
    SELECT COUNT(*) FROM "site_settings_map_config_cities"
  `)
  const count = Number((existingRows as any).rows?.[0]?.count ?? 0)
  if (count > 0) return

  const parentRows = await db.execute(sql`SELECT id FROM "site_settings" LIMIT 1`)
  const parentId = (parentRows as any).rows?.[0]?.id
  if (!parentId) return

  for (let i = 0; i < SEED_CITIES.length; i++) {
    const c = SEED_CITIES[i]
    await db.execute(sql`
      INSERT INTO "site_settings_map_config_cities"
        ("_order", "_parent_id", "id", "city", "country", "lat", "lng", "is_home")
      VALUES
        (${i + 1}, ${parentId}, ${`city-${i + 1}`}, ${c.city}, ${c.country}, ${c.lat}, ${c.lng}, ${c.isHome})
    `)
  }
}

export async function down({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`DELETE FROM "site_settings_map_config_cities"`)
}
