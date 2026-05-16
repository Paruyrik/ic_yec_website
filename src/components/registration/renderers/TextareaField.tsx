import type { FieldRendererProps } from '../fieldRegistry'
import type { TextareaFieldBlock } from '../types'
import { FieldWrapper, HelpText, INPUT_STYLE, Label } from './shared'

export function TextareaField({ block, fieldName, register, errors }: FieldRendererProps) {
  const b = block as TextareaFieldBlock
  const error = errors[fieldName] as { message?: string } | undefined
  return (
    <FieldWrapper error={error as any}>
      <Label text={b.label} required={b.required} />
      <HelpText text={b.helpText} />
      <textarea
        rows={b.rows ?? 4}
        placeholder={b.placeholder}
        style={{ ...INPUT_STYLE, resize: 'vertical' }}
        {...register(fieldName, {
          required: b.required ? `${b.label} is required` : false,
          minLength: b.minLength ? { value: b.minLength, message: `Minimum ${b.minLength} characters` } : undefined,
          maxLength: b.maxLength ? { value: b.maxLength, message: `Maximum ${b.maxLength} characters` } : undefined,
        })}
      />
    </FieldWrapper>
  )
}
