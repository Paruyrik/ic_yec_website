import type { FieldRendererProps } from '../fieldRegistry'
import type { HeadingFieldBlock } from '../types'

export function HeadingField({ block }: FieldRendererProps) {
  const b = block as HeadingFieldBlock
  const Tag = (b.level ?? 'h3') as 'h2' | 'h3' | 'h4'
  return (
    <Tag style={{ margin: '16px 0 4px', borderBottom: '1px solid #e0e0e0', paddingBottom: 4 }}>
      {b.text}
    </Tag>
  )
}
