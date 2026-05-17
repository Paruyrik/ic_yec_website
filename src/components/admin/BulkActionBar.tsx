'use client'

type Decision = 'shortlisted' | 'accepted' | 'rejected'

type Props = {
  count: number
  onDecision: (d: Decision) => void
  onExport: () => void
  onClear: () => void
}

const ACTIONS: { decision: Decision; label: string; bg: string; text: string }[] = [
  { decision: 'shortlisted', label: '★ Shortlist', bg: '#EEEDFE', text: '#3C3489' },
  { decision: 'accepted',    label: '✓ Accept',    bg: '#EAF3DE', text: '#3B6D11' },
  { decision: 'rejected',    label: '✕ Reject',    bg: '#FCEBEB', text: '#A32D2D' },
]

export function BulkActionBar({ count, onDecision, onExport, onClear }: Props) {
  if (count === 0) return null

  return (
    <div
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 flex items-center gap-3
                 bg-white rounded-xl shadow-hover px-5 py-3 border border-[#E2E1F5]"
      style={{ minWidth: 480 }}
    >
      <span style={{ fontSize: 14, fontWeight: 500, color: '#1A1833', whiteSpace: 'nowrap' }}>
        {count} selected
      </span>

      <div className="w-px h-5 bg-[#E2E1F5]" />

      <div className="flex gap-2">
        {ACTIONS.map((a) => (
          <button
            key={a.decision}
            type="button"
            onClick={() => onDecision(a.decision)}
            style={{
              background: a.bg, color: a.text,
              padding: '6px 14px', borderRadius: 8,
              fontSize: 13, fontWeight: 500, border: 'none', cursor: 'pointer',
            }}
          >
            {a.label}
          </button>
        ))}
      </div>

      <div className="w-px h-5 bg-[#E2E1F5]" />

      <button
        type="button"
        onClick={onExport}
        style={{
          background: '#EEEDFE', color: '#3D3785',
          padding: '6px 14px', borderRadius: 8,
          fontSize: 13, fontWeight: 500, border: 'none', cursor: 'pointer',
          whiteSpace: 'nowrap',
        }}
      >
        ⬇ Export selected
      </button>

      <button
        type="button"
        onClick={onClear}
        style={{
          marginLeft: 'auto', background: 'none', border: 'none',
          cursor: 'pointer', color: '#6B6B8D', fontSize: 18, lineHeight: 1,
          padding: '2px 4px',
        }}
        aria-label="Clear selection"
      >
        ×
      </button>
    </div>
  )
}
