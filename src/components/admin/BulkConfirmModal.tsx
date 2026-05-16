'use client'

import { useEffect } from 'react'

type Decision = 'accepted' | 'waitlisted' | 'rejected'

const CONFIG: Record<Decision, { label: string; bg: string; text: string; border: string }> = {
  accepted:   { label: 'Accept',   bg: '#EAF3DE', text: '#3B6D11', border: '#4F9A5E' },
  waitlisted: { label: 'Waitlist', bg: '#FEF3C7', text: '#92400E', border: '#D97706' },
  rejected:   { label: 'Reject',   bg: '#FCEBEB', text: '#A32D2D', border: '#D14242' },
}

type Props = {
  decision: Decision
  count: number
  sendEmail: boolean
  onToggleEmail: () => void
  onConfirm: () => void
  onCancel: () => void
  loading?: boolean
}

export function BulkConfirmModal({ decision, count, sendEmail, onToggleEmail, onConfirm, onCancel, loading }: Props) {
  const c = CONFIG[decision]

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onCancel()
      if (e.key === 'Enter') onConfirm()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onCancel, onConfirm])

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: 'rgba(26,24,51,0.55)' }}
      onClick={(e) => { if (e.target === e.currentTarget) onCancel() }}
    >
      <div
        className="bg-white rounded-xl shadow-hover w-full max-w-sm mx-4 overflow-hidden"
        style={{ border: `2px solid ${c.border}` }}
      >
        <div style={{ background: c.bg, padding: '20px 24px' }}>
          <h3 style={{ fontSize: 18, fontWeight: 500, color: c.text }}>
            {c.label} {count} applicant{count !== 1 ? 's' : ''}?
          </h3>
          <p style={{ fontSize: 14, color: c.text, opacity: 0.8, marginTop: 6 }}>
            This will update the status for all selected registrations.
          </p>
        </div>

        <div style={{ padding: '20px 24px' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', fontSize: 14 }}>
            <input
              type="checkbox"
              className="gdpr"
              checked={sendEmail}
              onChange={onToggleEmail}
            />
            Send notification email to applicants
          </label>

          <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
            <button
              type="button"
              onClick={onCancel}
              disabled={loading}
              style={{
                flex: 1, padding: '10px 0', borderRadius: 8, border: '1.5px solid #E2E1F5',
                background: 'transparent', fontSize: 14, fontWeight: 500, cursor: 'pointer',
                color: '#6B6B8D',
              }}
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={onConfirm}
              disabled={loading}
              style={{
                flex: 1, padding: '10px 0', borderRadius: 8, border: 'none',
                background: c.border, color: 'white', fontSize: 14, fontWeight: 500,
                cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1,
              }}
            >
              {loading ? 'Processing…' : 'Confirm'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
