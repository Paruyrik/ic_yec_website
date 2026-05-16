import type { FieldRendererProps } from '../fieldRegistry'

export function DividerField(_props: FieldRendererProps) {
  return <hr style={{ border: 'none', borderTop: '1px solid #e0e0e0', margin: '16px 0' }} />
}
