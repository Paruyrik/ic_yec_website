import type { FieldRendererProps } from '../fieldRegistry'
import type { UrlFieldBlock } from '../types'
import { FieldWrapper, HelpText, INPUT_STYLE, Label } from './shared'

export function UrlField({ block, fieldName, register, errors }: FieldRendererProps) {
  const b = block as UrlFieldBlock
  const error = errors[fieldName] as { message?: string } | undefined
  return (
    <FieldWrapper error={error as any}>
      <Label text={b.label} required={b.required} />
      <HelpText text={b.helpText} />
      <input
        type="url"
        placeholder={b.placeholder ?? 'https://'}
        style={INPUT_STYLE}
        {...register(fieldName, {
          required: b.required ? `${b.label} is required` : false,
          pattern: { value: /^https?:\/\/.+/, message: 'Enter a valid URL starting with https://' },
        })}
      />
    </FieldWrapper>
  )
}
