'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { BulkConfirmModal } from '@/components/admin/BulkConfirmModal'
import { StarButton } from '@/components/admin/StarButton'
import { useFavourites } from '@/hooks/useFavourites'
import { StatusPill } from '@/components/ui/StatusPill'
import { FilterBar } from '@/components/ui/FilterBar'
import { EmptyState } from '@/components/ui/EmptyState'

type Decision = 'shortlisted' | 'accepted' | 'rejected'
type Status = 'pending' | 'reviewing' | 'shortlisted' | 'interview' | 'accepted' | 'rejected'

type OpenCallOption = { id: string; title: string }

type Registration = {
  id: string
  applicantName: string
  email: string
  country: string
  status: Status
  createdAt: string
  openCall: { id: string; title: string } | string | null
}

const STATUS_OPTIONS = [
  { label: 'Pending',             value: 'pending' },
  { label: 'Reviewing',           value: 'reviewing' },
  { label: 'Shortlisted',         value: 'shortlisted' },
  { label: 'Interview scheduled', value: 'interview' },
  { label: 'Accepted',            value: 'accepted' },
  { label: 'Rejected',            value: 'rejected' },
]

function openCallId(r: Registration): string {
  if (!r.openCall) return ''
  if (typeof r.openCall === 'string') return r.openCall
  return r.openCall.id
}

function openCallTitle(r: Registration): string {
  if (!r.openCall) return '—'
  if (typeof r.openCall === 'string') return r.openCall
  return r.openCall.title
}

export default function RegistrationsPage() {
  const [rows, setRows] = useState<Registration[]>([])
  const [loading, setLoading] = useState(true)
  const [openCalls, setOpenCalls] = useState<OpenCallOption[]>([])

  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState('')
  const [filterOpenCall, setFilterOpenCall] = useState('')
  const [showFavsOnly, setShowFavsOnly] = useState(false)

  const [selected, setSelected] = useState<Set<string>>(new Set())
  const lastClickedRef = useRef<number | null>(null)

  const [pendingDecision, setPendingDecision] = useState<Decision | null>(null)
  const [sendEmail, setSendEmail] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  // favourites keyed by a global scope (empty string = all calls)
  const { favs, toggle: toggleFav, isFav } = useFavourites('all')

  // ── Fetch ────────────────────────────────────────────────────────────────
  async function fetchData() {
    setLoading(true)
    try {
      const params = new URLSearchParams({ limit: '200', depth: '1' })
      if (filterStatus)   params.set('where[status][equals]', filterStatus)
      if (filterOpenCall) params.set('where[openCall][equals]', filterOpenCall)

      const [regsRes, callsRes] = await Promise.all([
        fetch(`/api/registrations?${params}`),
        fetch('/api/open-calls?limit=100&depth=0'),
      ])
      const regsJson = await regsRes.json()
      const callsJson = await callsRes.json()
      setRows(regsJson.docs ?? [])
      setOpenCalls((callsJson.docs ?? []).map((c: { id: string; title: string }) => ({ id: c.id, title: c.title })))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchData() }, [filterStatus, filterOpenCall]) // eslint-disable-line react-hooks/exhaustive-deps

  // ── Derived filtered list ────────────────────────────────────────────────
  const filtered = rows.filter((r) => {
    if (showFavsOnly && !isFav(r.id)) return false
    if (search) {
      const q = search.toLowerCase()
      if (
        !r.applicantName.toLowerCase().includes(q) &&
        !r.email.toLowerCase().includes(q) &&
        !r.country.toLowerCase().includes(q)
      ) return false
    }
    return true
  })

  // ── Selection helpers ────────────────────────────────────────────────────
  function toggleRow(id: string, idx: number, e: React.MouseEvent) {
    setSelected((prev) => {
      const next = new Set(prev)
      if (e.shiftKey && lastClickedRef.current !== null) {
        const lo = Math.min(lastClickedRef.current, idx)
        const hi = Math.max(lastClickedRef.current, idx)
        filtered.slice(lo, hi + 1).forEach((r) => next.add(r.id))
      } else {
        if (next.has(id)) next.delete(id)
        else next.add(id)
      }
      return next
    })
    lastClickedRef.current = idx
  }

  function toggleAll() {
    if (selected.size === filtered.length) {
      setSelected(new Set())
    } else {
      setSelected(new Set(filtered.map((r) => r.id)))
    }
  }

  // ── Bulk decision ────────────────────────────────────────────────────────
  async function confirmDecision() {
    if (!pendingDecision) return
    setSubmitting(true)
    try {
      await fetch('/api/bulk-decision', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ids: [...selected],
          status: pendingDecision,
          sendEmail,
        }),
      })
      setSelected(new Set())
      setPendingDecision(null)
      await fetchData()
    } finally {
      setSubmitting(false)
    }
  }

  function handleExportSelected() {
    const ids = [...selected].join(',')
    window.open(`/api/export-registrations?format=csv&ids=${ids}`, '_blank')
  }

  // ── Starred summary ──────────────────────────────────────────────────────
  const starredCount = filtered.filter((r) => isFav(r.id)).length

  const allChecked = filtered.length > 0 && selected.size === filtered.length
  const someChecked = selected.size > 0 && selected.size < filtered.length

  return (
    <div style={{ padding: '32px 40px', fontFamily: 'system-ui, sans-serif', color: '#1A1833' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24, gap: 12 }}>
        <div style={{ flexShrink: 0 }}>
          <h1 style={{ fontSize: 22, fontWeight: 500, margin: 0 }}>Registrations</h1>
          <p style={{ fontSize: 13, color: '#6B6B8D', marginTop: 4 }}>
            {rows.length} total
            {starredCount > 0 && ` · ${starredCount} starred`}
          </p>
        </div>

        {selected.size > 0 ? (
          /* ── Selection action bar ── */
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
            <span style={{ fontSize: 13, fontWeight: 500, color: '#3D3785', padding: '6px 12px', background: '#EEEDFE', borderRadius: 8, whiteSpace: 'nowrap' }}>
              {selected.size} selected
            </span>
            <div style={{ width: 1, height: 24, background: '#E2E1F5', flexShrink: 0 }} />
            {([
              { decision: 'shortlisted' as Decision, label: '★ Shortlist', bg: '#EEEDFE', text: '#3C3489' },
              { decision: 'accepted'    as Decision, label: '✓ Accept',    bg: '#EAF3DE', text: '#3B6D11' },
              { decision: 'rejected'    as Decision, label: '✕ Reject',    bg: '#FCEBEB', text: '#A32D2D' },
            ]).map((a) => (
              <button
                key={a.decision}
                type="button"
                onClick={() => setPendingDecision(a.decision)}
                style={{ padding: '7px 14px', borderRadius: 8, fontSize: 13, fontWeight: 500, border: 'none', cursor: 'pointer', background: a.bg, color: a.text, whiteSpace: 'nowrap' }}
              >
                {a.label}
              </button>
            ))}
            <div style={{ width: 1, height: 24, background: '#E2E1F5', flexShrink: 0 }} />
            <button
              type="button"
              onClick={handleExportSelected}
              style={{ padding: '7px 14px', borderRadius: 8, fontSize: 13, fontWeight: 500, border: 'none', cursor: 'pointer', background: '#EEEDFE', color: '#3D3785', whiteSpace: 'nowrap' }}
            >
              ⬇ Export selected
            </button>
            <button
              type="button"
              onClick={() => setSelected(new Set())}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6B6B8D', fontSize: 18, lineHeight: 1, padding: '2px 6px' }}
              aria-label="Clear selection"
            >
              ×
            </button>
          </div>
        ) : (
          /* ── Default actions ── */
          <div style={{ display: 'flex', gap: 10 }}>
            <button
              type="button"
              onClick={() => setShowFavsOnly((v) => !v)}
              style={{
                padding: '7px 14px', borderRadius: 8, fontSize: 13, fontWeight: 500,
                border: '1.5px solid',
                borderColor: showFavsOnly ? '#D97706' : '#E2E1F5',
                background: showFavsOnly ? '#FEF3C7' : 'transparent',
                color: showFavsOnly ? '#92400E' : '#6B6B8D',
                cursor: 'pointer',
              }}
            >
              {showFavsOnly ? '★ Starred only' : '☆ Show starred'}
            </button>
            <a
              href="/api/export-registrations?format=csv"
              style={{
                padding: '7px 14px', borderRadius: 8, fontSize: 13, fontWeight: 500,
                background: '#EEEDFE', color: '#3D3785', textDecoration: 'none',
              }}
            >
              ⬇ Export all
            </a>
          </div>
        )}
      </div>

      {/* Filters */}
      <div style={{ marginBottom: 20 }}>
        <FilterBar
          search={{ value: search, onChange: setSearch, placeholder: 'Search name, email, country…' }}
          filters={[
            {
              key: 'status',
              label: 'All statuses',
              options: STATUS_OPTIONS,
              value: filterStatus,
              onChange: setFilterStatus,
            },
            {
              key: 'openCall',
              label: 'All open calls',
              options: openCalls.map((c) => ({ label: c.title, value: c.id })),
              value: filterOpenCall,
              onChange: setFilterOpenCall,
            },
          ]}
          count={filtered.length}
          countLabel="registrations"
        />
      </div>

      {/* Table */}
      <div style={{ background: 'white', borderRadius: 12, boxShadow: '0 2px 12px rgba(61,55,133,0.08)', overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: 48, textAlign: 'center', color: '#6B6B8D', fontSize: 14 }}>
            Loading…
          </div>
        ) : filtered.length === 0 ? (
          <EmptyState
            icon="📋"
            title="No registrations found"
            description="Try adjusting the filters or search term."
          />
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #E2E1F5', background: '#F8F8FC' }}>
                <th style={{ padding: '12px 16px', textAlign: 'left', width: 40 }}>
                  <input
                    type="checkbox"
                    className="gdpr"
                    checked={allChecked}
                    ref={(el) => { if (el) el.indeterminate = someChecked }}
                    onChange={toggleAll}
                  />
                </th>
                <th style={{ padding: '12px 8px', width: 36 }} />
                <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 500, fontSize: 12, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#6B6B8D' }}>
                  Applicant
                </th>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 500, fontSize: 12, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#6B6B8D' }}>
                  Open Call
                </th>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 500, fontSize: 12, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#6B6B8D' }}>
                  Country
                </th>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 500, fontSize: 12, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#6B6B8D' }}>
                  Status
                </th>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 500, fontSize: 12, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#6B6B8D' }}>
                  Submitted
                </th>
                <th style={{ padding: '12px 16px', width: 60 }} />
              </tr>
            </thead>
            <tbody>
              {filtered.map((r, idx) => {
                const isSelected = selected.has(r.id)
                const isStarred = isFav(r.id)
                const callId = openCallId(r)
                return (
                  <tr
                    key={r.id}
                    onClick={(e) => toggleRow(r.id, idx, e)}
                    style={{
                      borderBottom: '1px solid #F0EFF8',
                      background: isSelected ? '#EEEDFE' : 'white',
                      cursor: 'pointer',
                      transition: 'background 0.1s',
                    }}
                    onMouseEnter={(e) => {
                      if (!isSelected) (e.currentTarget as HTMLTableRowElement).style.background = '#F8F8FC'
                    }}
                    onMouseLeave={(e) => {
                      if (!isSelected) (e.currentTarget as HTMLTableRowElement).style.background = 'white'
                    }}
                  >
                    <td style={{ padding: '12px 16px' }} onClick={(e) => e.stopPropagation()}>
                      <input
                        type="checkbox"
                        className="gdpr"
                        checked={isSelected}
                        onChange={(e) => toggleRow(r.id, idx, e as unknown as React.MouseEvent)}
                      />
                    </td>
                    <td style={{ padding: '12px 8px' }} onClick={(e) => e.stopPropagation()}>
                      <StarButton
                        active={isStarred}
                        onClick={() => toggleFav(r.id)}
                      />
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <div style={{ fontWeight: 500, color: '#1A1833' }}>{r.applicantName}</div>
                      <div style={{ fontSize: 12, color: '#6B6B8D', marginTop: 2 }}>{r.email}</div>
                    </td>
                    <td style={{ padding: '12px 16px', color: '#6B6B8D' }}>
                      {callId ? (
                        <Link href={`/admin/collections/open-calls/${callId}`} style={{ color: '#3D3785', fontWeight: 500 }} onClick={(e) => e.stopPropagation()}>
                          {openCallTitle(r)}
                        </Link>
                      ) : '—'}
                    </td>
                    <td style={{ padding: '12px 16px', color: '#6B6B8D' }}>{r.country}</td>
                    <td style={{ padding: '12px 16px' }}>
                      <StatusPill status={r.status as Parameters<typeof StatusPill>[0]['status']} />
                    </td>
                    <td style={{ padding: '12px 16px', color: '#6B6B8D', fontSize: 13 }}>
                      {new Date(r.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </td>
                    <td style={{ padding: '12px 16px' }} onClick={(e) => e.stopPropagation()}>
                      <Link
                        href={`/admin/registrations/${r.id}`}
                        style={{
                          fontSize: 12, fontWeight: 500, color: '#3D3785',
                          padding: '4px 10px', borderRadius: 6,
                          background: '#EEEDFE', textDecoration: 'none',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        Review →
                      </Link>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Confirm modal */}
      {pendingDecision && (
        <BulkConfirmModal
          decision={pendingDecision}
          count={selected.size}
          sendEmail={sendEmail}
          onToggleEmail={() => setSendEmail((v) => !v)}
          onConfirm={confirmDecision}
          onCancel={() => setPendingDecision(null)}
          loading={submitting}
        />
      )}
    </div>
  )
}
