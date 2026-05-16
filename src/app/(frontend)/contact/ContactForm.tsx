'use client'

import { useState } from 'react'
import { INPUT_STYLE } from '@/components/registration/renderers/shared'

type Status = 'idle' | 'submitting' | 'success' | 'error'

export default function ContactForm() {
  const [status, setStatus] = useState<Status>('idle')

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setStatus('submitting')
    const fd = new FormData(e.currentTarget)
    const body = Object.fromEntries(fd.entries())

    const res = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })

    setStatus(res.ok ? 'success' : 'error')
  }

  if (status === 'success') {
    return (
      <div style={{ textAlign: 'center', padding: '48px 0' }}>
        <div style={{ fontSize: 36, marginBottom: 16 }}>✓</div>
        <h2 style={{ marginBottom: 10 }}>Message sent!</h2>
        <p style={{ color: 'var(--color-text-muted)' }}>We'll get back to you within a few business days.</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <label style={{ fontWeight: 500, fontSize: 14 }}>Name <span style={{ color: '#c0392b' }}>*</span></label>
          <input name="name" type="text" required style={INPUT_STYLE} placeholder="Your name" />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <label style={{ fontWeight: 500, fontSize: 14 }}>Email <span style={{ color: '#c0392b' }}>*</span></label>
          <input name="email" type="email" required style={INPUT_STYLE} placeholder="your@email.com" />
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        <label style={{ fontWeight: 500, fontSize: 14 }}>Subject <span style={{ color: '#c0392b' }}>*</span></label>
        <input name="subject" type="text" required style={INPUT_STYLE} placeholder="What's this about?" />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        <label style={{ fontWeight: 500, fontSize: 14 }}>Message <span style={{ color: '#c0392b' }}>*</span></label>
        <textarea name="message" required rows={6} style={{ ...INPUT_STYLE, resize: 'vertical' }} placeholder="Tell us more…" />
      </div>

      {status === 'error' && (
        <p style={{ color: '#c0392b', fontSize: 14 }}>Something went wrong. Please try again or email us directly.</p>
      )}

      <button
        type="submit"
        disabled={status === 'submitting'}
        className="btn btn-primary"
        style={{ alignSelf: 'flex-start', opacity: status === 'submitting' ? 0.7 : 1 }}
      >
        {status === 'submitting' ? 'Sending…' : 'Send message'}
      </button>
    </form>
  )
}
