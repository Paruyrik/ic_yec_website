import type { FieldRendererProps } from '../fieldRegistry'
import type { CheckboxFieldBlock } from '../types'
import { FieldWrapper, HelpText } from './shared'

export function CheckboxField({ block, fieldName, register, errors }: FieldRendererProps) {
  const b = block as CheckboxFieldBlock
  const error = errors[fieldName] as { message?: string } | undefined
  return (
    <FieldWrapper error={error as any}>
      <label style={{ display: 'flex', alignItems: 'flex-start', gap: 10, cursor: 'pointer' }}>
        <input
          type="checkbox"
          style={{ marginTop: 3, flexShrink: 0 }}
          {...register(fieldName, {
            required: b.required ? `You must agree to continue` : false,
          })}
        />
        <span style={{ fontSize: 14 }}>
          {b.label}
          {b.required && <span style={{ color: '#c0392b', marginLeft: 2 }}>*</span>}
        </span>
      </label>
      <HelpText text={b.helpText} />
    </FieldWrapper>
  )
}
