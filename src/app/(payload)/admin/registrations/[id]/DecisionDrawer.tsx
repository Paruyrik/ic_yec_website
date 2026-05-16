'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useFavourites } from '@/hooks/useFavourites'

type Decision = 'accepted' | 'waitlisted' | 'rejected'

type RegistrationData = {
  id: string
  applicantName: string
  email: string
  country: string
  age: number | null
  status: string
  openCallTitle: string
  openCallId: string
  submittedAt: string
  cvUrl: string | null
  notes: string
  motivationLetter: string
}

const DECISION_CONFIG: Record<Decision, { label: string; icon: string; bg: string; border: string; text: string }> = {
  accepted:   { label: 'Accept',   icon: '✓', bg: '#EAF3DE', border: '#4F9A5E', text: '#3B6D11' },
  waitlisted: { label: 'Waitlist', icon: '⏱', bg: '#FEF3C7', border: '#D97706', text: '#92400E' },
  rejected:   { label: 'Reject',   icon: '✕', bg: '#FCEBEB', border: '#D14242', text: '#A32D2D' },
}

const STATUS_CONFIG: Record<string, { bg: string; text: string; label: string }> = {
  pending:    { bg: '#FAEEDA', text: '#633806', label: 'Pending review' },
  reviewing:  { bg: '#E6F1FB', text: '#0C447C', label: 'Under review' },
  accepted:   { bg: '#EAF3DE', text: '#3B6D11', label: 'Accepted' },
  rejected:   { bg: '#FCEBEB', text: '#A32D2D', label: 'Rejected' },
  waitlisted: { bg: '#EEEDFE', text: '#3C3489', label: 'Waitlisted' },
}

const EMAIL_PREVIEW: Record<Decision, { subject: string; body: string }> = {
  accepted:   { subject: "Congratulations — you've been accepted!", body: 'We are delighted to inform you that your application has been selected…' },
  waitlisted: { subject: 'Your application status update',          body: 'Thank you for applying. You have been placed on our waitlist…' },
  rejected:   { subject: 'Your application — IC-YEC',              body: 'Thank you for taking the time to apply. After careful review…' },
}

function initials(name: string) {
  return name.split(' ').map((p) => p[0]).join('').slice(0, 2).toUpperCase()
}

export default function DecisionDrawer({ registration: reg }: { registration: RegistrationData }) {
  const [decision,      setDecision]     = useState<Decision | null>(null)
  const [sendEmail,     setSendEmail]    = useState(true)
  const [ccCoord,       setCcCoord]      = useState(true)
  const [notes,         setNotes]        = useState(reg.notes)
  const [saving,        setSaving]       = useState(false)
  const [currentStatus, setCurrentStatus] = useState(reg.status)
  const [toast,         setToast]        = useState<{ msg: string; ok: boolean } | null>(null)

  const { toggle: toggleFav, isFav } = useFavourites(reg.openCallId)
  const starred = isFav(reg.id)

  const statusCfg = STATUS_CONFIG[currentStatus] ?? { bg: '#F0F0F0', text: '#888', label: currentStatus }

  function showToast(msg: string, ok: boolean) {
    setToast({ msg, ok })
    setTimeout(() => setToast(null), 3000)
  }

  async function markReviewing() {
    setSaving(true)
    try {
      const res = await fetch(`/api/registrations/${reg.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'reviewing' }),
      })
      if (!res.ok) throw new Error('Failed')
      setCurrentStatus('reviewing')
      showToast('Marked as reviewing', true)
    } catch {
      showToast('Failed to update', false)
    } finally {
      setSaving(false)
    }
  }

  async function handleConfirm() {
    if (!decision) return
    setSaving(true)
    try {
      const res = await fetch(`/api/registrations/${reg.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: decision, notes }),
      })
      if (!res.ok) throw new Error('Failed to update')

      if (sendEmail) {
        await fetch('/api/send-decision-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ registrationId: reg.id, decision, ccCoordinator: ccCoord }),
        })
      }

      setCurrentStatus(decision)
      setDecision(null)
      showToast(`${DECISION_CONFIG[decision].label}ed${sendEmail ? ' · email sent' : ''}`, true)
    } catch (err: any) {
      showToast(err.message ?? 'Error', false)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', minHeight: '100vh', background: '#F8F8FC', color: '#1A1833' }}>
      {/* Toast */}
      {toast && (
        <div style={{
          position: 'fixed', top: 20, right: 20, zIndex: 1000,
          background: toast.ok ? '#3B6D11' : '#A32D2D',
          color: 'white', padding: '12px 20px', borderRadius: 8, fontSize: 14,
          boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
        }}>
          {toast.ok ? '✓' : '✕'} {toast.msg}
        </div>
      )}

      <div style={{ padding: '28px 32px', maxWidth: 1100, margin: '0 auto' }}>
        {/* Back link */}
        <Link href="/admin/collections/registrations"
          style={{ fontSize: 13, color: '#3D3785', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 4, marginBottom: 20 }}>
          ← All registrations
        </Link>

        {/* ── 2-col layout ─────────────────────────────────────────────────── */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 24, alignItems: 'start' }}>

          {/* ══ LEFT — applicant content ══════════════════════════════════ */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

            {/* Applicant header */}
            <div style={{
              background: '#3D3785', borderRadius: 12,
              padding: '22px 24px', display: 'flex', alignItems: 'center', gap: 16,
            }}>
              <div style={{
                width: 56, height: 56, borderRadius: '50%',
                background: 'rgba(255,255,255,0.15)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 20, color: 'white', fontWeight: 500, flexShrink: 0,
              }}>
                {initials(reg.applicantName)}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <h1 style={{ color: 'white', fontSize: 20, fontWeight: 500, margin: '0 0 4px' }}>
                  {reg.applicantName}
                </h1>
                <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13, margin: 0 }}>
                  {reg.openCallTitle}
                  <span style={{ margin: '0 6px', opacity: 0.4 }}>·</span>
                  {reg.country}
                  {reg.age != null && <><span style={{ margin: '0 6px', opacity: 0.4 }}>·</span>Age {reg.age}</>}
                </p>
              </div>
              <a href={`mailto:${reg.email}`} style={{
                padding: '7px 14px', borderRadius: 8, fontSize: 13, fontWeight: 500,
                background: 'rgba(255,255,255,0.12)', color: 'white',
                textDecoration: 'none', flexShrink: 0,
              }}>
                ✉ Email
              </a>
            </div>

            {/* Application details */}
            <Card title="Application details">
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 0 }}>
                {[
                  ['Email',      <a key="e" href={`mailto:${reg.email}`} style={{ color: '#3D3785' }}>{reg.email}</a>],
                  ['Submitted',  reg.submittedAt],
                  ['Country',    reg.country],
                  ['Age',        reg.age != null ? `${reg.age} years` : '—'],
                  ['CV',         reg.cvUrl
                    ? <a key="cv" href={reg.cvUrl} target="_blank" rel="noopener noreferrer" style={{ color: '#3D3785' }}>Download ↗</a>
                    : 'Not uploaded'],
                ].map(([label, value]) => (
                  <div key={String(label)} style={{ display: 'flex', flexDirection: 'column', gap: 2, padding: '10px 0', borderBottom: '1px solid #F0EFF8' }}>
                    <span style={{ fontSize: 11, fontWeight: 500, letterSpacing: '0.07em', textTransform: 'uppercase', color: '#6B6B8D' }}>
                      {label}
                    </span>
                    <span style={{ fontSize: 14, color: '#1A1833' }}>{value}</span>
                  </div>
                ))}
              </div>
            </Card>

            {/* Motivation letter */}
            {reg.motivationLetter && (
              <Card title="Motivation letter">
                <p style={{
                  fontSize: 14, color: '#1A1833', lineHeight: 1.75,
                  whiteSpace: 'pre-wrap', margin: 0,
                }}>
                  {reg.motivationLetter}
                </p>
              </Card>
            )}

            {/* Internal notes */}
            <Card title="Internal notes  (not sent to applicant)">
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={4}
                placeholder="Add notes visible only to admins…"
                style={{
                  width: '100%', padding: '10px 12px', fontSize: 14,
                  border: '1px solid #E2E1F5', borderRadius: 8,
                  resize: 'vertical', boxSizing: 'border-box',
                  color: '#1A1833', outline: 'none',
                }}
                onFocus={(e)  => (e.currentTarget.style.borderColor = '#3D3785')}
                onBlur={(e)   => (e.currentTarget.style.borderColor = '#E2E1F5')}
              />
              <button
                onClick={async () => {
                  setSaving(true)
                  try {
                    await fetch(`/api/registrations/${reg.id}`, {
                      method: 'PATCH',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ notes }),
                    })
                    showToast('Notes saved', true)
                  } catch { showToast('Failed to save notes', false) }
                  finally { setSaving(false) }
                }}
                disabled={saving}
                style={{
                  marginTop: 10, padding: '8px 18px', borderRadius: 8, border: 'none',
                  background: '#EEEDFE', color: '#3D3785', fontSize: 13, fontWeight: 500,
                  cursor: 'pointer',
                }}
              >
                Save notes
              </button>
            </Card>
          </div>

          {/* ══ RIGHT — action panel ═══════════════════════════════════════ */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14, position: 'sticky', top: 24 }}>

            {/* Status + favourite */}
            <div style={{
              background: 'white', borderRadius: 12,
              boxShadow: '0 2px 12px rgba(61,55,133,0.08)',
              overflow: 'hidden',
            }}>
              <div style={{ padding: '16px 18px', borderBottom: '1px solid #F0EFF8', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 12, fontWeight: 500, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#6B6B8D' }}>
                  Current status
                </span>
                {/* Favourite star */}
                <button
                  onClick={() => toggleFav(reg.id)}
                  title={starred ? 'Remove from favourites' : 'Add to favourites'}
                  style={{
                    background: starred ? '#FEF3C7' : '#F8F8FC',
                    border: `1.5px solid ${starred ? '#D97706' : '#E2E1F5'}`,
                    borderRadius: 8, padding: '5px 10px',
                    fontSize: 16, cursor: 'pointer',
                    color: starred ? '#D97706' : '#C5C5D8',
                    display: 'flex', alignItems: 'center', gap: 5,
                    transition: 'all 0.15s',
                  }}
                >
                  {starred ? '★' : '☆'}
                  <span style={{ fontSize: 12, fontWeight: 500 }}>
                    {starred ? 'Starred' : 'Star'}
                  </span>
                </button>
              </div>
              <div style={{ padding: '16px 18px' }}>
                <span style={{
                  display: 'inline-flex', alignItems: 'center', gap: 6,
                  padding: '8px 16px', borderRadius: 100,
                  background: statusCfg.bg, color: statusCfg.text,
                  fontSize: 14, fontWeight: 500,
                }}>
                  {statusCfg.label}
                </span>

                {/* Quick "mark as reviewing" — only when pending */}
                {currentStatus === 'pending' && (
                  <button
                    onClick={markReviewing}
                    disabled={saving}
                    style={{
                      display: 'block', width: '100%', marginTop: 12,
                      padding: '9px', borderRadius: 8,
                      border: '1.5px solid #E2E1F5', background: 'white',
                      fontSize: 13, fontWeight: 500, color: '#0C447C',
                      cursor: 'pointer', textAlign: 'center',
                    }}
                  >
                    🔍 Mark as reviewing
                  </button>
                )}
              </div>
            </div>

            {/* Decision panel */}
            <div style={{
              background: 'white', borderRadius: 12,
              boxShadow: '0 2px 12px rgba(61,55,133,0.08)',
              overflow: 'hidden',
              border: decision ? `2px solid ${DECISION_CONFIG[decision].border}` : '2px solid transparent',
              transition: 'border-color 0.2s',
            }}>
              <div style={{ padding: '14px 18px', borderBottom: '1px solid #F0EFF8' }}>
                <span style={{ fontSize: 12, fontWeight: 500, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#6B6B8D' }}>
                  Set decision
                </span>
                {!decision && (
                  <span style={{
                    marginLeft: 8, fontSize: 11, fontWeight: 500, padding: '2px 8px',
                    borderRadius: 100, background: '#FAEEDA', color: '#633806',
                  }}>
                    Action needed
                  </span>
                )}
              </div>
              <div style={{ padding: '14px 18px', display: 'flex', flexDirection: 'column', gap: 8 }}>
                {(Object.entries(DECISION_CONFIG) as [Decision, typeof DECISION_CONFIG[Decision]][]).map(([key, cfg]) => (
                  <button
                    key={key}
                    onClick={() => setDecision(decision === key ? null : key)}
                    style={{
                      padding: '11px 14px', borderRadius: 8, cursor: 'pointer',
                      border: `1.5px solid ${decision === key ? cfg.border : '#E2E1F5'}`,
                      background: decision === key ? cfg.bg : 'white',
                      color: decision === key ? cfg.text : '#6B6B8D',
                      fontWeight: decision === key ? 500 : 400,
                      fontSize: 14, textAlign: 'left',
                      display: 'flex', alignItems: 'center', gap: 10,
                      transition: 'all 0.15s',
                    }}
                  >
                    <span style={{
                      width: 26, height: 26, borderRadius: '50%', flexShrink: 0,
                      background: decision === key ? cfg.border : '#F0EFF8',
                      color: decision === key ? 'white' : '#6B6B8D',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 13, fontWeight: 600,
                    }}>
                      {cfg.icon}
                    </span>
                    {cfg.label}
                  </button>
                ))}
              </div>

              {/* Email toggles + preview — shown when decision selected */}
              {decision && (
                <div style={{ padding: '0 18px 16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <div style={{ height: 1, background: '#F0EFF8', margin: '0 0 4px' }} />
                  <Toggle label="Email applicant" checked={sendEmail}    onChange={setSendEmail} />
                  <Toggle label="CC coordinator"  checked={ccCoord}     onChange={setCcCoord}   />

                  {sendEmail && (
                    <div style={{ background: '#EEEDFE', borderRadius: 8, padding: '12px 14px', marginTop: 4 }}>
                      <p style={{ fontSize: 11, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.07em', color: '#3D3785', marginBottom: 6 }}>
                        Email preview
                      </p>
                      <p style={{ fontSize: 13, fontWeight: 500, color: '#1A1833', marginBottom: 3 }}>
                        {EMAIL_PREVIEW[decision].subject}
                      </p>
                      <p style={{ fontSize: 12, color: '#6B6B8D', margin: 0, lineHeight: 1.5 }}>
                        {EMAIL_PREVIEW[decision].body}
                      </p>
                    </div>
                  )}

                  {/* Confirm button */}
                  <button
                    onClick={handleConfirm}
                    disabled={saving}
                    style={{
                      marginTop: 4, padding: '13px', borderRadius: 8, border: 'none',
                      cursor: saving ? 'not-allowed' : 'pointer',
                      background: DECISION_CONFIG[decision].border,
                      color: 'white', fontSize: 14, fontWeight: 500,
                      opacity: saving ? 0.7 : 1, transition: 'opacity 0.15s',
                    }}
                  >
                    {saving ? 'Saving…' : `Confirm ${DECISION_CONFIG[decision].label}`}
                  </button>
                  <button
                    onClick={() => setDecision(null)}
                    style={{
                      padding: '10px', borderRadius: 8,
                      border: '1.5px solid #E2E1F5', background: 'white',
                      fontSize: 13, color: '#6B6B8D', cursor: 'pointer',
                    }}
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>

            {/* Export panel */}
            <div style={{
              background: 'white', borderRadius: 12,
              boxShadow: '0 2px 12px rgba(61,55,133,0.08)',
              overflow: 'hidden',
            }}>
              <div style={{ padding: '14px 18px', borderBottom: '1px solid #F0EFF8' }}>
                <span style={{ fontSize: 12, fontWeight: 500, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#6B6B8D' }}>
                  Export
                </span>
              </div>
              <div style={{ padding: '12px 18px', display: 'flex', flexDirection: 'column', gap: 8 }}>
                {[
                  { href: `/api/export-registrations?openCallId=${reg.openCallId}&format=csv`,                 label: '📊 All applications CSV' },
                  { href: `/api/export-registrations?openCallId=${reg.openCallId}&status=accepted&format=csv`, label: '✓ Accepted only CSV' },
                  { href: `/api/export-registrations?openCallId=${reg.openCallId}&format=zip`,                 label: '📦 All CVs ZIP' },
                ].map((btn) => (
                  <a key={btn.label} href={btn.href} style={{
                    padding: '9px 12px', borderRadius: 8, fontSize: 13, fontWeight: 500,
                    background: '#F8F8FC', color: '#3D3785', textDecoration: 'none',
                    display: 'block', transition: 'background 0.15s',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = '#EEEDFE')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = '#F8F8FC')}
                  >
                    {btn.label}
                  </a>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}

// ── helpers ───────────────────────────────────────────────────────────────────

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ background: 'white', borderRadius: 12, overflow: 'hidden', boxShadow: '0 2px 12px rgba(61,55,133,0.08)' }}>
      <div style={{ padding: '14px 20px', borderBottom: '1px solid #F0EFF8', fontSize: 12, fontWeight: 500, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#6B6B8D' }}>
        {title}
      </div>
      <div style={{ padding: '18px 20px' }}>{children}</div>
    </div>
  )
}

function Toggle({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', gap: 8 }}>
      <span style={{ fontSize: 13, color: '#1A1833' }}>{label}</span>
      <div
        onClick={() => onChange(!checked)}
        style={{
          width: 36, height: 20, borderRadius: 10, flexShrink: 0,
          background: checked ? '#3D3785' : '#D9D9D9',
          position: 'relative', transition: 'background 0.2s', cursor: 'pointer',
        }}
      >
        <div style={{
          position: 'absolute', top: 3, left: checked ? 19 : 3,
          width: 14, height: 14, borderRadius: '50%', background: 'white',
          transition: 'left 0.2s', boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
        }} />
      </div>
    </label>
  )
}
