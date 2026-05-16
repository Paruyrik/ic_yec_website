import type { FieldRendererProps } from '../fieldRegistry'
import type { RadioFieldBlock } from '../types'
import { FieldWrapper, HelpText, Label } from './shared'

export function RadioField({ block, fieldName, register, errors }: FieldRendererProps) {
  const b = block as RadioFieldBlock
  const error = errors[fieldName] as { message?: string } | undefined
  return (
    <FieldWrapper error={error as any}>
      <Label text={b.label} required={b.required} />
      <HelpText text={b.helpText} />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {b.options.map((opt) => (
          <label key={opt.value} style={{ display: 'flex', alignItems: 'center', gap: 8, fontWeight: 'normal', cursor: 'pointer' }}>
            <input
              type="radio"
              value={opt.value}
              {...register(fieldName, {
                required: b.required ? `Please select an option for "${b.label}"` : false,
              })}
            />
            {opt.label}
          </label>
        ))}
      </div>
    </FieldWrapper>
  )
}
