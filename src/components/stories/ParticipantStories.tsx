'use client'

import React, { useState } from 'react'

interface Story {
  id: string
  quote: string
  author: string
  age?: number | null
  country: string
  projectName?: string | null
}

interface Props {
  stories: Story[]
}

export function ParticipantStories({ stories }: Props) {
  const [idx, setIdx] = useState(0)
  if (stories.length === 0) return null

  const story = stories[idx]

  return (
    <div style={{ position: 'relative', maxWidth: 720, margin: '0 auto' }}>
      {/* Quote card */}
      <div style={{
        background: 'white',
        borderRadius: 16,
        padding: '44px 48px',
        boxShadow: '0 4px 32px rgba(0,0,0,0.08)',
        textAlign: 'center',
        minHeight: 220,
      }}>
        {/* Quote mark */}
        <div style={{
          fontSize: 72,
          lineHeight: 0.6,
          color: 'var(--color-accent)',
          fontFamily: 'Georgia, serif',
          marginBottom: 24,
          opacity: 0.6,
        }}>&ldquo;</div>

        <p style={{
          fontSize: 18,
          lineHeight: 1.65,
          color: 'var(--color-text)',
          fontStyle: 'italic',
          marginBottom: 28,
        }}>
          {story.quote}
        </p>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12 }}>
          {/* Avatar initials */}
          <div style={{
            width: 44,
            height: 44,
            borderRadius: '50%',
            background: 'var(--color-primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontWeight: 600,
            fontSize: 16,
            flexShrink: 0,
          }}>
            {story.author.split(' ').map(n => n[0]).join('').slice(0, 2)}
          </div>
          <div style={{ textAlign: 'left' }}>
            <div style={{ fontWeight: 500, fontSize: 15, color: 'var(--color-text)' }}>
              {story.author}
              {story.age && <span style={{ color: 'var(--color-text-muted)', fontWeight: 400, fontSize: 14 }}>, {story.age}</span>}
            </div>
            <div style={{ fontSize: 13, color: 'var(--color-text-muted)' }}>
              {story.country}{story.projectName ? ` · ${story.projectName}` : ''}
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      {stories.length > 1 && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16, marginTop: 24 }}>
          <button
            onClick={() => setIdx((idx - 1 + stories.length) % stories.length)}
            style={{
              width: 36, height: 36, borderRadius: '50%',
              border: '1.5px solid var(--color-border)',
              background: 'white', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 16, color: 'var(--color-text)',
            }}
          >‹</button>

          {/* Dots */}
          <div style={{ display: 'flex', gap: 6 }}>
            {stories.map((_, i) => (
              <button
                key={i}
                onClick={() => setIdx(i)}
                style={{
                  width: i === idx ? 20 : 7,
                  height: 7,
                  borderRadius: 100,
                  border: 'none',
                  background: i === idx ? 'var(--color-primary)' : 'var(--color-border)',
                  cursor: 'pointer',
                  padding: 0,
                  transition: 'all 0.2s',
                }}
              />
            ))}
          </div>

          <button
            onClick={() => setIdx((idx + 1) % stories.length)}
            style={{
              width: 36, height: 36, borderRadius: '50%',
              border: '1.5px solid var(--color-border)',
              background: 'white', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 16, color: 'var(--color-text)',
            }}
          >›</button>
        </div>
      )}
    </div>
  )
}
