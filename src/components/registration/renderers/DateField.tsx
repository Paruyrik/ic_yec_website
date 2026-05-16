import type { FieldRendererProps } from '../fieldRegistry'
import type { DateFieldBlock } from '../types'
import { FieldWrapper, HelpText, INPUT_STYLE, Label } from './shared'

export function DateField({ block, fieldName, register, errors }: FieldRendererProps) {
  const b = block as DateFieldBlock
  const error = errors[fieldName] as { message?: string } | undefined
  return (
    <FieldWrapper error={error as any}>
      <Label text={b.label} required={b.required} />
      <HelpText text={b.helpText} />
      <input
        type="date"
        min={b.minDate?.substring(0, 10)}
        max={b.maxDate?.substring(0, 10)}
        style={INPUT_STYLE}
        {...register(fieldName, {
          required: b.required ? `${b.label} is required` : false,
        })}
      />
    </FieldWrapper>
  )
}
