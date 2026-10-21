// Shared helpers for the `posts` collection - safe to import from the Payload
// config and from both Server and Client components.

export const POST_CATEGORIES = [
  { value: 'news',         label: 'News',         color: '#3D3785', bg: '#EEEDFE' },
  { value: 'event',        label: 'Event',        color: '#0E7490', bg: '#E0F4F8' },
  { value: 'story',        label: 'Story',        color: '#9D4B4B', bg: '#FBEDED' },
  { value: 'announcement', label: 'Announcement', color: '#92400E', bg: '#FEF3C7' },
] as const

export type PostCategory = (typeof POST_CATEGORIES)[number]['value']

export function postCategory(value: string | null | undefined) {
  return POST_CATEGORIES.find((c) => c.value === value) ?? POST_CATEGORIES[0]
}

export function formatPostDate(d: string) {
  return new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
}

/** Collect the plain text of a Lexical rich-text value. */
function lexicalText(node: unknown): string {
  if (!node || typeof node !== 'object') return ''
  const n = node as { text?: unknown; children?: unknown[]; root?: unknown }
  if (n.root) return lexicalText(n.root)
  const own = typeof n.text === 'string' ? n.text : ''
  const kids = Array.isArray(n.children) ? n.children.map(lexicalText).join(' ') : ''
  return `${own} ${kids}`
}

/** Estimated reading time in minutes (≈200 words/min, minimum 1). */
export function readingMinutes(content: unknown, excerpt?: string | null): number {
  const words = `${lexicalText(content)} ${excerpt ?? ''}`.split(/\s+/).filter(Boolean).length
  return Math.max(1, Math.round(words / 200))
}
