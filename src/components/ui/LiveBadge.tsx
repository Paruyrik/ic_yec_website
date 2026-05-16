'use client'

import React from 'react'

interface Props {
  variant?: 'live' | 'urgent'
  label?: string
}

export function LiveBadge({ variant = 'live', label }: Props) {
  const isLive = variant === 'live'
  const color = isLive ? '#22c55e' : '#ef4444'
  const text = label ?? (isLive ? 'Live' : 'Closing soon')

  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: 6,
      padding: '3px 10px 3px 7px',
      borderRadius: 100,
      background: isLive ? 'rgba(34,197,94,0.12)' : 'rgba(239,68,68,0.12)',
      fontSize: 12,
      fontWeight: 500,
      color,
    }}>
      <span style={{
        width: 7,
        height: 7,
        borderRadius: '50%',
        background: color,
        display: 'inline-block',
        animation: 'livePulse 1.8s ease-in-out infinite',
      }} />
      {text}
      <style>{`
        @keyframes livePulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(1.4); }
        }
      `}</style>
    </span>
  )
}
