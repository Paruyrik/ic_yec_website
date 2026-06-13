'use client'

import { useEffect, useState } from 'react'
import { useField, useFormFields } from '@payloadcms/ui'

function toSlug(str: string): string {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '') // strip diacritics
    .replace(/[^a-z0-9\s-]/g, '')   // keep alphanumeric, spaces, hyphens
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
}

export function SlugField({ path }: { path: string }) {
  const { value, setValue } = useField<string>({ path })
  const [locked, setLocked] = useState(true)

  const titleValue = useFormFields(([fields]) => fields['title']?.value as string | undefined)

  // Keep slug in sync with title while locked
  useEffect(() => {
    if (locked && titleValue) {
      setValue(toSlug(titleValue))
    }
  }, [titleValue, locked, setValue])

  function regenerate() {
    if (titleValue) setValue(toSlug(titleValue))
  }

  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 6, color: '#333' }}>
        Slug <span style={{ color: '#e00' }}>*</span>
      </div>

      <div style={{ display: 'flex', gap: 6 }}>
        <input
          type="text"
          value={value ?? ''}
          readOnly={locked}
          onChange={(e) => setValue(e.target.value)}
          style={{
            flex: 1,
            padding: '8px 12px',
            fontSize: 13,
            fontFamily: 'monospace',
            border: '1px solid #d0d0d0',
            borderRadius: 4,
            background: locked ? '#f5f5f5' : 'white',
            color: locked ? '#888' : '#111',
            cursor: locked ? 'default' : 'text',
            outline: 'none',
          }}
        />

        <button
          type="button"
          title={locked ? 'Unlock to edit manually' : 'Lock - auto-sync with title'}
          onClick={() => setLocked((v) => !v)}
          style={{
            padding: '8px 12px',
            borderRadius: 4,
            border: '1px solid #d0d0d0',
            background: locked ? '#f5f5f5' : '#fff3cd',
            color: locked ? '#555' : '#856404',
            fontSize: 13,
            cursor: 'pointer',
            flexShrink: 0,
          }}
        >
          {locked ? '🔒' : '🔓'}
        </button>

        <button
          type="button"
          title="Regenerate from current title"
          onClick={regenerate}
          style={{
            padding: '8px 12px',
            borderRadius: 4,
            border: '1px solid #d0d0d0',
            background: '#f0f0f0',
            color: '#444',
            fontSize: 13,
            cursor: 'pointer',
            flexShrink: 0,
            whiteSpace: 'nowrap',
          }}
        >
          ↺ From title
        </button>
      </div>

      {!locked && (
        <p style={{ fontSize: 11, color: '#856404', margin: '5px 0 0' }}>
          Manual mode - click 🔒 to re-lock and auto-sync with title
        </p>
      )}
    </div>
  )
}
