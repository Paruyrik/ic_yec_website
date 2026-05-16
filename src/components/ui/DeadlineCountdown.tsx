'use client'

import React, { useEffect, useState } from 'react'

interface TimeLeft {
  days: number
  hours: number
  minutes: number
  seconds: number
  expired: boolean
}

function calc(deadline: string): TimeLeft {
  const diff = new Date(deadline).getTime() - Date.now()
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0, expired: true }
  const d = Math.floor(diff / 86400000)
  const h = Math.floor((diff % 86400000) / 3600000)
  const m = Math.floor((diff % 3600000) / 60000)
  const s = Math.floor((diff % 60000) / 1000)
  return { days: d, hours: h, minutes: m, seconds: s, expired: false }
}

export function DeadlineCountdown({ deadline }: { deadline: string }) {
  const [time, setTime] = useState<TimeLeft>(calc(deadline))

  useEffect(() => {
    const id = setInterval(() => setTime(calc(deadline)), 1000)
    return () => clearInterval(id)
  }, [deadline])

  if (time.expired) return null

  const isUrgent = time.days < 3

  const parts = time.days > 0
    ? [
        { n: time.days,    label: 'days' },
        { n: time.hours,   label: 'hrs' },
        { n: time.minutes, label: 'min' },
      ]
    : [
        { n: time.hours,   label: 'hrs' },
        { n: time.minutes, label: 'min' },
        { n: time.seconds, label: 'sec' },
      ]

  return (
    <div style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: 4,
      padding: '6px 12px',
      borderRadius: 10,
      background: isUrgent ? 'rgba(239,68,68,0.08)' : 'var(--color-tint)',
      border: `1px solid ${isUrgent ? 'rgba(239,68,68,0.2)' : 'var(--color-border)'}`,
    }}>
      <span style={{ fontSize: 12, color: 'var(--color-text-muted)', marginRight: 4 }}>Closes in</span>
      {parts.map(({ n, label }, i) => (
        <React.Fragment key={label}>
          {i > 0 && <span style={{ color: 'var(--color-text-muted)', fontSize: 13 }}>:</span>}
          <span style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: 28 }}>
            <span style={{
              fontSize: 15,
              fontWeight: 600,
              color: isUrgent ? '#ef4444' : 'var(--color-primary)',
              fontVariantNumeric: 'tabular-nums',
            }}>
              {String(n).padStart(2, '0')}
            </span>
            <span style={{ fontSize: 9, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              {label}
            </span>
          </span>
        </React.Fragment>
      ))}
    </div>
  )
}
