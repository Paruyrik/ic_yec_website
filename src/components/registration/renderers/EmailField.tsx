import type { FieldRendererProps } from '../fieldRegistry'
import type { EmailFieldBlock } from '../types'
import { FieldWrapper, HelpText, INPUT_STYLE, Label } from './shared'

export function EmailField({ block, fieldName, register, errors }: FieldRendererProps) {
  const b = block as EmailFieldBlock
  const error = errors[fieldName] as { message?: string } | undefined
  return (
    <FieldWrapper error={error as any}>
      <Label text={b.label} required={b.required} />
      <HelpText text={b.helpText} />
      <input
        type="email"
        placeholder={b.placeholder ?? 'name@example.com'}
        style={INPUT_STYLE}
        {...register(fieldName, {
          required: b.required ? `${b.label} is required` : false,
          pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Enter a valid email address' },
        })}
      />
    </FieldWrapper>
  )
}
