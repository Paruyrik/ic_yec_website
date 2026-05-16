// Shared locale utilities — safe to import in both Server and Client components.

export type Locale = 'en' | 'hy' | 'ru'

export const LOCALES: { code: Locale; label: string }[] = [
  { code: 'en', label: 'English' },
  { code: 'hy', label: 'Հայերեն' },
  { code: 'ru', label: 'Русский' },
]

export const LOCALE_COOKIE = 'ic-yec-locale'

/** Pick a localised string from a Payload field that may be a plain string or locale map. */
export function localStr(val: unknown, locale: Locale = 'en'): string {
  if (!val) return ''
  if (typeof val === 'string') return val
  const map = val as Record<string, string>
  return map[locale] || map['en'] || Object.values(map).find(Boolean) || ''
}
