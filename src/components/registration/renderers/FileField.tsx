'use client'
import type { FileFieldBlock } from '../types'
import { FieldWrapper, HelpText, INPUT_STYLE, Label } from './shared'
import type { FieldRendererProps } from '../fieldRegistry'

export function FileField({ block, fieldName, register, errors }: FieldRendererProps) {
  const b = block as FileFieldBlock
  const error = errors[fieldName] as { message?: string } | undefined
  const maxBytes = (b.maxSizeMB ?? 5) * 1024 * 1024

  return (
    <FieldWrapper error={error as any}>
      <Label text={b.label} required={b.required} />
      <HelpText text={b.helpText} />
      {b.accept && (
        <span style={{ fontSize: 12, color: '#888' }}>
          Accepted formats: {b.accept} — max {b.maxSizeMB ?? 5} MB
        </span>
      )}
      <input
        type="file"
        accept={b.accept}
        multiple={b.multiple}
        style={{ ...INPUT_STYLE, padding: '6px 8px' }}
        {...register(fieldName, {
          required: b.required ? `${b.label} is required` : false,
          validate: {
            fileSize: (files: FileList | null) => {
              if (!files || files.length === 0) return true
              for (const file of Array.from(files)) {
                if (file.size > maxBytes) return `File must be under ${b.maxSizeMB ?? 5} MB`
              }
              return true
            },
          },
        })}
      />
    </FieldWrapper>
  )
}
