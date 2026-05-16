import type { FieldRendererProps } from '../fieldRegistry'
import type { PhoneFieldBlock } from '../types'
import { FieldWrapper, HelpText, INPUT_STYLE, Label } from './shared'

export function PhoneField({ block, fieldName, register, errors }: FieldRendererProps) {
  const b = block as PhoneFieldBlock
  const error = errors[fieldName] as { message?: string } | undefined
  return (
    <FieldWrapper error={error as any}>
      <Label text={b.label} required={b.required} />
      <HelpText text={b.helpText} />
      <input
        type="tel"
        placeholder={b.placeholder ?? '+1 234 567 8900'}
        style={INPUT_STYLE}
        {...register(fieldName, {
          required: b.required ? `${b.label} is required` : false,
        })}
      />
    </FieldWrapper>
  )
}
