import type { FieldRendererProps } from '../fieldRegistry'
import type { TextFieldBlock } from '../types'
import { FieldWrapper, HelpText, INPUT_STYLE, Label } from './shared'

export function TextField({ block, fieldName, register, errors }: FieldRendererProps) {
  const b = block as TextFieldBlock
  const error = errors[fieldName] as { message?: string } | undefined
  return (
    <FieldWrapper error={error as any}>
      <Label text={b.label} required={b.required} />
      <HelpText text={b.helpText} />
      <input
        type="text"
        placeholder={b.placeholder}
        style={INPUT_STYLE}
        {...register(fieldName, {
          required: b.required ? `${b.label} is required` : false,
          minLength: b.minLength ? { value: b.minLength, message: `Minimum ${b.minLength} characters` } : undefined,
          maxLength: b.maxLength ? { value: b.maxLength, message: `Maximum ${b.maxLength} characters` } : undefined,
        })}
      />
    </FieldWrapper>
  )
}
