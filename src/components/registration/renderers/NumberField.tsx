import type { FieldRendererProps } from '../fieldRegistry'
import type { NumberFieldBlock } from '../types'
import { FieldWrapper, HelpText, INPUT_STYLE, Label } from './shared'

export function NumberField({ block, fieldName, register, errors }: FieldRendererProps) {
  const b = block as NumberFieldBlock
  const error = errors[fieldName] as { message?: string } | undefined
  return (
    <FieldWrapper error={error as any}>
      <Label text={b.label} required={b.required} />
      <HelpText text={b.helpText} />
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <input
          type="number"
          placeholder={b.placeholder}
          min={b.min}
          max={b.max}
          step={b.step ?? 1}
          style={INPUT_STYLE}
          {...register(fieldName, {
            required: b.required ? `${b.label} is required` : false,
            min: b.min != null ? { value: b.min, message: `Minimum value is ${b.min}` } : undefined,
            max: b.max != null ? { value: b.max, message: `Maximum value is ${b.max}` } : undefined,
          })}
        />
        {b.unit && <span style={{ whiteSpace: 'nowrap', fontSize: 14, color: '#555' }}>{b.unit}</span>}
      </div>
    </FieldWrapper>
  )
}
