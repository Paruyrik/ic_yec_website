import type { FieldRendererProps } from '../fieldRegistry'
import type { ParagraphFieldBlock } from '../types'

export function ParagraphField({ block }: FieldRendererProps) {
  const b = block as ParagraphFieldBlock
  return (
    <p style={{ margin: '4px 0', fontSize: 14, color: '#555', lineHeight: 1.6 }}>
      {b.text}
    </p>
  )
}
