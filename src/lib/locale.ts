// Server-only - uses next/headers (cookies). Do NOT import from Client Components.
// For shared types/helpers, import from '@/lib/locale-shared' instead.

import { cookies } from 'next/headers'
export type { Locale } from './locale-shared'
export { LOCALES, LOCALE_COOKIE, localStr } from './locale-shared'
import { LOCALE_COOKIE, type Locale } from './locale-shared'

export async function getLocale(): Promise<Locale> {
  const store = await cookies()
  const val = store.get(LOCALE_COOKIE)?.value
  if (val === 'hy' || val === 'ru') return val
  return 'en'
}
