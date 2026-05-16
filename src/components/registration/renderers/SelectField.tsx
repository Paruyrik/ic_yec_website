import type { FieldRendererProps } from '../fieldRegistry'
import type { SelectFieldBlock } from '../types'
import { FieldWrapper, HelpText, INPUT_STYLE, Label } from './shared'

export function SelectField({ block, fieldName, register, errors }: FieldRendererProps) {
  const b = block as SelectFieldBlock
  const error = errors[fieldName] as { message?: string } | undefined
  return (
    <FieldWrapper error={error as any}>
      <Label text={b.label} required={b.required} />
      <HelpText text={b.helpText} />
      <select
        multiple={b.multiple}
        style={{ ...INPUT_STYLE, height: b.multiple ? Math.min(b.options.length * 32 + 8, 160) : undefined }}
        {...register(fieldName, {
          required: b.required ? `${b.label} is required` : false,
        })}
      >
        {!b.multiple && <option value="">— Select —</option>}
        {b.options.map((opt) => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
      {b.multiple && <span style={{ fontSize: 12, color: '#888' }}>Hold Ctrl / Cmd to select multiple</span>}
    </FieldWrapper>
  )
}
