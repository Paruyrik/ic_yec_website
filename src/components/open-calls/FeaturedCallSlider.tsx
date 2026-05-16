'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'

interface FeaturedCall {
  id: string
  title: string
  slug: string
  type: string
  location?: string | null
  deadline: string
  dateRange?: string | null
  ageMin?: number | null
  ageMax?: number | null
  spots?: number | null
}

interface Props {
  calls: FeaturedCall[]
}

const TYPE_LABELS: Record<string, string> = {
  'youth-exchange':   'Youth exchange',
  'training-course':  'Training course',
  'esc-volunteering': 'ESC Volunteering',
  'seminar':          'Seminar',
  'other':            'Other',
}

function fmtDeadline(d: string) {
  return new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
}

function daysLeft(d: string) {
  return Math.ceil((new Date(d).getTime() - Date.now()) / 86_400_000)
}

export function FeaturedCallSlider({ calls }: Props) {
  const [idx, setIdx] = useState(0)

  useEffect(() => {
    if (calls.length <= 1) return
    const id = setInterval(() => setIdx(i => (i + 1) % calls.length), 5000)
    return () => clearInterval(id)
  }, [calls.length])

  if (calls.length === 0) return null

  const call = calls[idx]
  const days = daysLeft(call.deadline)
  const isUrgent = days <= 7

  const rows = [
    call.type       && { label: 'Type',   value: TYPE_LABELS[call.type] ?? call.type },
    call.dateRange  && { label: 'Dates',  value: call.dateRange },
    (call.ageMin != null) && { label: 'Age', value: `${call.ageMin}–${call.ageMax ?? 35} years` },
    call.spots      && { label: 'Spots',  value: `${call.spots} available` },
  ].filter(Boolean) as { label: string; value: string }[]

  return (
    <div style={{ position: 'relative' }}>
      {/* Card */}
      <div style={{
        borderRadius: 20,
        overflow: 'hidden',
        background: 'white',
        boxShadow: '0 20px 60px rgba(0,0,0,0.25)',
        width: 420,
      }}>
        {/* Solid purple header — matches screenshot */}
        <div style={{
          background: '#3D3785',
          padding: '26px 28px 24px',
        }}>
          <div style={{
            fontSize: 10,
            fontWeight: 700,
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.55)',
            marginBottom: 14,
            display: 'flex',
            alignItems: 'center',
            gap: 7,
          }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#E8A0A0', display: 'inline-block', flexShrink: 0 }} />
            Featured Open Call
            {calls.length > 1 && (
              <span style={{ marginLeft: 'auto', fontSize: 11, color: 'rgba(255,255,255,0.35)', fontWeight: 400, letterSpacing: 0 }}>
                {idx + 1} / {calls.length}
              </span>
            )}
          </div>
          <h3 style={{
            fontSize: 20,
            fontWeight: 600,
            color: 'white',
            lineHeight: 1.3,
            marginBottom: call.location ? 10 : 0,
          }}>
            {call.title}
          </h3>
          {call.location && (
            <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)', display: 'flex', alignItems: 'center', gap: 6 }}>
              <span>📍</span> {call.location}
            </div>
          )}
        </div>

        {/* Info rows */}
        <div style={{ background: 'white' }}>
          {rows.map((row, i) => (
            <div key={row.label} style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '15px 28px',
              borderBottom: i < rows.length - 1 ? '1px solid #f0f0f5' : 'none',
            }}>
              <span style={{ fontSize: 14, color: '#9290b0', fontWeight: 400 }}>{row.label}</span>
              <span style={{ fontSize: 14, fontWeight: 700, color: '#1a1833' }}>{row.value}</span>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '16px 22px',
          background: '#f8f7fc',
          borderTop: '1px solid #f0f0f5',
        }}>
          <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            padding: '8px 14px',
            borderRadius: 100,
            background: isUrgent ? 'rgba(239,68,68,0.08)' : '#fdecea',
            fontSize: 13,
            fontWeight: 500,
            color: isUrgent ? '#dc2626' : '#b05236',
          }}>
            <span>⏰</span>
            Closes {fmtDeadline(call.deadline)}
          </span>

          <Link
            href={`/open-calls/${call.slug}`}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              padding: '11px 22px',
              background: '#1a1833',
              color: 'white',
              borderRadius: 12,
              fontSize: 14,
              fontWeight: 700,
              textDecoration: 'none',
              letterSpacing: '0.01em',
            }}
          >
            Apply now →
          </Link>
        </div>
      </div>

      {/* Slider dots */}
      {calls.length > 1 && (
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: 6,
          marginTop: 14,
        }}>
          {calls.map((_, i) => (
            <button
              key={i}
              onClick={() => setIdx(i)}
              style={{
                width: i === idx ? 18 : 6,
                height: 6,
                borderRadius: 100,
                border: 'none',
                background: i === idx ? 'white' : 'rgba(255,255,255,0.35)',
                cursor: 'pointer',
                padding: 0,
                transition: 'all 0.25s',
              }}
            />
          ))}
        </div>
      )}
    </div>
  )
}
