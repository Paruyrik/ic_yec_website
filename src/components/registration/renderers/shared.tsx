import type { FieldError } from 'react-hook-form'

export function FieldWrapper({ children, error }: { children: React.ReactNode; error?: FieldError }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      {children}
      {error && (
        <span style={{ color: '#c0392b', fontSize: 13 }}>{error.message || 'Required'}</span>
      )}
    </div>
  )
}

export function Label({ text, required }: { text: string; required?: boolean }) {
  return (
    <label style={{ fontWeight: 600, fontSize: 14 }}>
      {text}
      {required && <span style={{ color: '#c0392b', marginLeft: 2 }}>*</span>}
    </label>
  )
}

export function HelpText({ text }: { text?: string }) {
  if (!text) return null
  return <span style={{ color: '#666', fontSize: 13 }}>{text}</span>
}

export const INPUT_STYLE: React.CSSProperties = {
  width: '100%',
  padding: '8px 12px',
  border: '1px solid #ccc',
  borderRadius: 6,
  fontSize: 15,
  boxSizing: 'border-box',
}
