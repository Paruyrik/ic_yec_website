// ─── Field Renderer Registry ─────────────────────────────────────────────────
//
// HOW TO ADD A NEW FIELD TYPE
// ───────────────────────────
// 1. Add a Block definition to src/collections/OpenCalls.ts (FORM_FIELD_BLOCKS)
// 2. Add a TypeScript type to src/components/registration/types.ts (FormFieldBlock union)
// 3. Create a renderer in src/components/registration/renderers/YourField.tsx
// 4. Import and register it in FIELD_RENDERERS below - that's all.
//
// The RegistrationForm component never needs to change.

import type { Control, FieldErrors, UseFormRegister } from 'react-hook-form'
import type { FormFieldBlock } from './types'

import { CheckboxField } from './renderers/CheckboxField'
import { CheckboxGroupField } from './renderers/CheckboxGroupField'
import { CountryField } from './renderers/CountryField'
import { DateField } from './renderers/DateField'
import { EmailField } from './renderers/EmailField'
import { FileField } from './renderers/FileField'
import { HeadingField } from './renderers/HeadingField'
import { NumberField } from './renderers/NumberField'
import { ParagraphField } from './renderers/ParagraphField'
import { PhoneField } from './renderers/PhoneField'
import { RadioField } from './renderers/RadioField'
import { SelectField } from './renderers/SelectField'
import { TextField } from './renderers/TextField'
import { TextareaField } from './renderers/TextareaField'
import { UrlField } from './renderers/UrlField'
import { DividerField } from './renderers/DividerField'

export type FieldRendererProps = {
  block: FormFieldBlock
  /** Unique react-hook-form field name, e.g. "dynamic_2" */
  fieldName: string
  register: UseFormRegister<any>
  control: Control<any>
  errors: FieldErrors<any>
}

type FieldRenderer = (props: FieldRendererProps) => React.ReactNode

// Registry: blockType → renderer
// Add new entries here when introducing a new field type.
const FIELD_RENDERERS: Record<string, FieldRenderer> = {
  textField: TextField,
  textareaField: TextareaField,
  emailField: EmailField,
  phoneField: PhoneField,
  numberField: NumberField,
  dateField: DateField,
  selectField: SelectField,
  radioField: RadioField,
  checkboxField: CheckboxField,
  checkboxGroupField: CheckboxGroupField,
  fileField: FileField,
  urlField: UrlField,
  countryField: CountryField,
  headingField: HeadingField,
  paragraphField: ParagraphField,
  dividerField: DividerField,
}

/**
 * Renders a single form field block.
 * Returns null (and logs a warning) for unknown blockTypes so the form
 * stays functional even if a renderer isn't registered yet.
 */
export function renderField(props: FieldRendererProps): React.ReactNode {
  const renderer = FIELD_RENDERERS[props.block.blockType]
  if (!renderer) {
    console.warn(`[RegistrationForm] No renderer registered for blockType "${props.block.blockType}"`)
    return null
  }
  return renderer(props)
}
