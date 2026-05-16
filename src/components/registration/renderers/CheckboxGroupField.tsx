'use client'
import type { CheckboxGroupFieldBlock } from '../types'
import { FieldWrapper, HelpText, Label } from './shared'
import type { FieldRendererProps } from '../fieldRegistry'

export function CheckboxGroupField({ block, fieldName, register, errors }: FieldRendererProps) {
  const b = block as CheckboxGroupFieldBlock
  const error = errors[fieldName] as { message?: string } | undefined

  return (
    <FieldWrapper error={error as any}>
      <Label text={b.label} required={b.required} />
      <HelpText text={b.helpText} />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {b.options.map((opt) => (
          <label key={opt.value} style={{ display: 'flex', alignItems: 'center', gap: 8, fontWeight: 'normal', cursor: 'pointer' }}>
            <input
              type="checkbox"
              value={opt.value}
              {...register(`${fieldName}.${opt.value}` as const, {
                validate: () => true,
              })}
            />
            {opt.label}
          </label>
        ))}
      </div>
    </FieldWrapper>
  )
}
