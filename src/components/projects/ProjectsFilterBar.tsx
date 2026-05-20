'use client'

import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { useTransition, useState, useEffect, useRef } from 'react'

const STATUSES = [
  { label: 'Ongoing',   value: 'ongoing' },
  { label: 'Completed', value: 'completed' },
  { label: 'Upcoming',  value: 'upcoming' },
]

const THEMES = [
  { label: 'Art',                    value: 'art' },
  { label: 'Sport',                  value: 'sport' },
  { label: 'Emotional Intelligence', value: 'emotional-intelligence' },
  { label: 'Training',               value: 'training' },
  { label: 'Inclusion',              value: 'inclusion' },
  { label: 'Digital',                value: 'digital' },
  { label: 'Environment',            value: 'environment' },
]

interface Props {
  total: number
  currentStatus: string
  currentTheme: string
  currentQ: string
}

export function ProjectsFilterBar({ total, currentStatus, currentTheme, currentQ }: Props) {
  const router    = useRouter()
  const pathname  = usePathname()
  const params    = useSearchParams()
  const [isPending, startTransition] = useTransition()
  const [q, setQ] = useState(currentQ)
  const debounce  = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Keep local search input in sync if the URL changes (e.g. browser back)
  useEffect(() => { setQ(currentQ) }, [currentQ])

  function push(updates: Record<string, string>) {
    const next = new URLSearchParams(params.toString())
    for (const [k, v] of Object.entries(updates)) {
      if (v) next.set(k, v); else next.delete(k)
    }
    next.delete('page') // reset to page 1 on any filter change
    startTransition(() => router.push(`${pathname}?${next.toString()}`, { scroll: false }))
  }

  function handleSearch(value: string) {
    setQ(value)
    if (debounce.current) clearTimeout(debounce.current)
    debounce.current = setTimeout(() => push({ q: value }), 380)
  }

  const selectStyle: React.CSSProperties = {
    padding: '8px 12px', border: '1px solid var(--color-border)',
    borderRadius: 8, fontSize: 14, background: 'white',
    color: 'var(--color-text)', cursor: 'pointer', outline: 'none',
  }

  return (
    <div style={{
      display: 'flex', flexWrap: 'wrap', gap: 10, alignItems: 'center',
      opacity: isPending ? 0.55 : 1, transition: 'opacity 0.15s',
    }}>
      {/* Search */}
      <div style={{ position: 'relative' }}>
        <span style={{
          position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)',
          fontSize: 13, pointerEvents: 'none', color: 'var(--color-text-muted)',
        }}>🔍</span>
        <input
          type="search"
          value={q}
          onChange={(e) => handleSearch(e.target.value)}
          placeholder="Search projects…"
          style={{
            paddingLeft: 32, paddingRight: 12,
            paddingTop: 8, paddingBottom: 8,
            border: '1px solid var(--color-border)', borderRadius: 8,
            fontSize: 14, background: 'white',
            color: 'var(--color-text)', width: 210, outline: 'none',
          }}
        />
      </div>

      {/* Status */}
      <select
        value={currentStatus}
        onChange={(e) => push({ status: e.target.value })}
        style={selectStyle}
        aria-label="Filter by status"
      >
        <option value="">All statuses</option>
        {STATUSES.map((s) => (
          <option key={s.value} value={s.value}>{s.label}</option>
        ))}
      </select>

      {/* Theme */}
      <select
        value={currentTheme}
        onChange={(e) => push({ theme: e.target.value })}
        style={selectStyle}
        aria-label="Filter by theme"
      >
        <option value="">All themes</option>
        {THEMES.map((t) => (
          <option key={t.value} value={t.value}>{t.label}</option>
        ))}
      </select>

      {/* Count */}
      <span style={{
        marginLeft: 'auto', fontSize: 13,
        color: 'var(--color-text-muted)', whiteSpace: 'nowrap',
      }}>
        {total} project{total !== 1 ? 's' : ''}
      </span>
    </div>
  )
}
