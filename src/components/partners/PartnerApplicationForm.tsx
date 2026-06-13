'use client'

import { useState } from 'react'
import Link from 'next/link'

const ORG_TYPES = [
  { value: 'youth-ngo',    label: 'Youth NGO / Association' },
  { value: 'school',       label: 'School / University' },
  { value: 'youth-centre', label: 'Youth Centre' },
  { value: 'cultural',     label: 'Cultural Organisation' },
  { value: 'municipality', label: 'Municipality / Public Authority' },
  { value: 'other',        label: 'Other' },
]

const PROJECT_TYPES = [
  { value: 'youth-exchange',   label: '🌍 Youth Exchange' },
  { value: 'training-course',  label: '📚 Training Course' },
  { value: 'esc-volunteering', label: '🤝 ESC Volunteering' },
  { value: 'seminar',          label: '🎤 Seminar / Event' },
  { value: 'other',            label: '💡 Other / Not sure yet' },
]

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '11px 14px',
  border: '1.5px solid var(--color-border)',
  borderRadius: 8, fontSize: 15,
  background: 'white', color: 'var(--color-text)',
  outline: 'none', boxSizing: 'border-box',
  fontFamily: 'inherit',
}

const labelStyle: React.CSSProperties = {
  display: 'block', fontSize: 13, fontWeight: 500,
  color: 'var(--color-text)', marginBottom: 6,
}

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div>
      <label style={labelStyle}>
        {label} {required && <span style={{ color: '#e53e3e' }}>*</span>}
      </label>
      {children}
    </div>
  )
}

export function PartnerApplicationForm() {
  const [form, setForm] = useState({
    orgName: '', orgType: '', country: '', website: '',
    contactName: '', email: '', contactRole: '',
    projectInterests: [] as string[],
    message: '', howHeard: '',
  })
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  function set(field: string, value: string) {
    setForm((f) => ({ ...f, [field]: value }))
  }

  function toggleInterest(value: string) {
    setForm((f) => ({
      ...f,
      projectInterests: f.projectInterests.includes(value)
        ? f.projectInterests.filter((v) => v !== value)
        : [...f.projectInterests, value],
    }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      const res = await fetch('/api/partner-application', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error || 'Something went wrong.'); return }
      setSuccess(true)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } catch {
      setError('Network error - please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  // ── Success state ──────────────────────────────────────────────────────────
  if (success) {
    return (
      <div style={{
        background: 'white', borderRadius: 'var(--radius-lg)',
        padding: '56px 40px', textAlign: 'center',
        boxShadow: 'var(--shadow-card)',
        border: '1px solid var(--color-border)',
      }}>
        <div style={{
          width: 72, height: 72, borderRadius: '50%',
          background: 'rgba(72,187,120,0.15)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 24px',
          fontSize: 32,
        }}>✅</div>
        <h2 style={{ fontSize: 24, fontWeight: 600, marginBottom: 12, color: 'var(--color-text)' }}>
          Application received!
        </h2>
        <p style={{ fontSize: 16, color: 'var(--color-text-muted)', lineHeight: 1.7, marginBottom: 8, maxWidth: 460, margin: '0 auto 12px' }}>
          Thank you, <strong style={{ color: 'var(--color-text)' }}>{form.contactName}</strong>! We've received your partnership application from <strong style={{ color: 'var(--color-text)' }}>{form.orgName}</strong>.
        </p>
        <p style={{ fontSize: 15, color: 'var(--color-text-muted)', lineHeight: 1.7, maxWidth: 460, margin: '0 auto 32px' }}>
          Our team will review your application and get back to you at <strong style={{ color: 'var(--color-text)' }}>{form.email}</strong> within <strong style={{ color: 'var(--color-text)' }}>3–5 business days</strong>.
        </p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/" style={{
            padding: '11px 24px', background: 'var(--color-primary)', color: 'white',
            borderRadius: 8, fontWeight: 500, fontSize: 14, textDecoration: 'none',
          }}>
            Back to home
          </Link>
          <button
            onClick={() => { setSuccess(false); setForm({ orgName: '', orgType: '', country: '', website: '', contactName: '', email: '', contactRole: '', projectInterests: [], message: '', howHeard: '' }) }}
            style={{
              padding: '11px 24px', background: 'var(--color-tint)', color: 'var(--color-primary)',
              borderRadius: 8, fontWeight: 500, fontSize: 14,
              border: '1px solid var(--color-border)', cursor: 'pointer',
            }}
          >
            Submit another
          </button>
        </div>
      </div>
    )
  }

  // ── Form ───────────────────────────────────────────────────────────────────
  return (
    <form onSubmit={handleSubmit} noValidate>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>

        {/* Section: Organisation */}
        <div style={{ background: 'white', borderRadius: 'var(--radius-lg)', overflow: 'hidden', boxShadow: 'var(--shadow-card)', border: '1px solid var(--color-border)' }}>
          <div className="form-section-header">🏢 About your organisation</div>
          <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: 18 }}>
            <div className="form-row-2">
              <Field label="Organisation name" required>
                <input style={inputStyle} value={form.orgName} onChange={(e) => set('orgName', e.target.value)} placeholder="e.g. Youth Association XYZ" required />
              </Field>
              <Field label="Type of organisation" required>
                <select style={inputStyle} value={form.orgType} onChange={(e) => set('orgType', e.target.value)} required>
                  <option value="">Select type…</option>
                  {ORG_TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
                </select>
              </Field>
            </div>
            <div className="form-row-2">
              <Field label="Country" required>
                <input style={inputStyle} value={form.country} onChange={(e) => set('country', e.target.value)} placeholder="e.g. Germany" required />
              </Field>
              <Field label="Website">
                <input style={inputStyle} type="url" value={form.website} onChange={(e) => set('website', e.target.value)} placeholder="https://yourorg.eu" />
              </Field>
            </div>
          </div>
        </div>

        {/* Section: Contact person */}
        <div style={{ background: 'white', borderRadius: 'var(--radius-lg)', overflow: 'hidden', boxShadow: 'var(--shadow-card)', border: '1px solid var(--color-border)' }}>
          <div className="form-section-header">👤 Contact person</div>
          <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: 18 }}>
            <div className="form-row-2">
              <Field label="Full name" required>
                <input style={inputStyle} value={form.contactName} onChange={(e) => set('contactName', e.target.value)} placeholder="e.g. Maria Schmidt" required />
              </Field>
              <Field label="Role / Title">
                <input style={inputStyle} value={form.contactRole} onChange={(e) => set('contactRole', e.target.value)} placeholder="e.g. Project Manager" />
              </Field>
            </div>
            <Field label="Email address" required>
              <input style={inputStyle} type="email" value={form.email} onChange={(e) => set('email', e.target.value)} placeholder="maria@yourorg.eu" required />
            </Field>
          </div>
        </div>

        {/* Section: Partnership interest */}
        <div style={{ background: 'white', borderRadius: 'var(--radius-lg)', overflow: 'hidden', boxShadow: 'var(--shadow-card)', border: '1px solid var(--color-border)' }}>
          <div className="form-section-header">🤝 Partnership interest</div>
          <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: 18 }}>
            <Field label="Project types you're interested in" required>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 10, marginTop: 4 }}>
                {PROJECT_TYPES.map((pt) => {
                  const checked = form.projectInterests.includes(pt.value)
                  return (
                    <label key={pt.value} style={{
                      display: 'flex', alignItems: 'center', gap: 10,
                      padding: '10px 14px',
                      background: checked ? 'var(--color-tint)' : 'var(--color-bg)',
                      border: `1.5px solid ${checked ? 'var(--color-primary)' : 'var(--color-border)'}`,
                      borderRadius: 8, cursor: 'pointer',
                      fontSize: 14, fontWeight: checked ? 500 : 400,
                      color: checked ? 'var(--color-primary)' : 'var(--color-text)',
                      transition: 'all 0.12s',
                    }}>
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => toggleInterest(pt.value)}
                        style={{ display: 'none' }}
                      />
                      {pt.label}
                    </label>
                  )
                })}
              </div>
            </Field>
            <Field label="Tell us about your organisation and your partnership idea" required>
              <textarea
                style={{ ...inputStyle, minHeight: 140, resize: 'vertical' }}
                value={form.message}
                onChange={(e) => set('message', e.target.value)}
                placeholder="Describe your organisation, your experience with youth work, and what kind of collaboration you have in mind…"
                required
              />
            </Field>
            <Field label="How did you hear about IC-YEC?">
              <input style={inputStyle} value={form.howHeard} onChange={(e) => set('howHeard', e.target.value)} placeholder="e.g. Social media, colleague recommendation, Erasmus+ portal…" />
            </Field>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div style={{
            padding: '14px 18px', background: '#FFF5F5', border: '1px solid #FEB2B2',
            borderRadius: 8, color: '#c53030', fontSize: 14,
          }}>
            {error}
          </div>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={submitting}
          style={{
            padding: '14px 32px',
            background: submitting ? '#a0aec0' : 'var(--color-primary)',
            color: 'white', borderRadius: 10,
            fontWeight: 600, fontSize: 15,
            border: 'none', cursor: submitting ? 'not-allowed' : 'pointer',
            alignSelf: 'flex-start',
            transition: 'background 0.15s',
          }}
        >
          {submitting ? 'Sending…' : 'Submit partnership application →'}
        </button>
      </div>
    </form>
  )
}
