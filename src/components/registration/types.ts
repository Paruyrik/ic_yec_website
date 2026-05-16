// Types mirroring the block configs defined in src/collections/OpenCalls.ts.
// When you add a new block there, add a matching type here and export it from
// FormFieldBlock so TypeScript narrows it everywhere automatically.

export type TextFieldBlock = {
  blockType: 'textField'
  id?: string
  label: string
  placeholder?: string
  helpText?: string
  required?: boolean
  minLength?: number
  maxLength?: number
}

export type TextareaFieldBlock = {
  blockType: 'textareaField'
  id?: string
  label: string
  placeholder?: string
  helpText?: string
  required?: boolean
  rows?: number
  minLength?: number
  maxLength?: number
}

export type EmailFieldBlock = {
  blockType: 'emailField'
  id?: string
  label: string
  placeholder?: string
  helpText?: string
  required?: boolean
}

export type PhoneFieldBlock = {
  blockType: 'phoneField'
  id?: string
  label: string
  placeholder?: string
  helpText?: string
  required?: boolean
  international?: boolean
}

export type NumberFieldBlock = {
  blockType: 'numberField'
  id?: string
  label: string
  placeholder?: string
  helpText?: string
  required?: boolean
  min?: number
  max?: number
  step?: number
  unit?: string
}

export type DateFieldBlock = {
  blockType: 'dateField'
  id?: string
  label: string
  helpText?: string
  required?: boolean
  minDate?: string
  maxDate?: string
}

export type SelectOption = { label: string; value: string }

export type SelectFieldBlock = {
  blockType: 'selectField'
  id?: string
  label: string
  helpText?: string
  required?: boolean
  multiple?: boolean
  options: SelectOption[]
}

export type RadioFieldBlock = {
  blockType: 'radioField'
  id?: string
  label: string
  helpText?: string
  required?: boolean
  options: SelectOption[]
}

export type CheckboxFieldBlock = {
  blockType: 'checkboxField'
  id?: string
  label: string
  helpText?: string
  required?: boolean
}

export type CheckboxGroupFieldBlock = {
  blockType: 'checkboxGroupField'
  id?: string
  label: string
  helpText?: string
  required?: boolean
  options: SelectOption[]
}

export type FileFieldBlock = {
  blockType: 'fileField'
  id?: string
  label: string
  helpText?: string
  required?: boolean
  accept?: string
  maxSizeMB?: number
  multiple?: boolean
}

export type UrlFieldBlock = {
  blockType: 'urlField'
  id?: string
  label: string
  placeholder?: string
  helpText?: string
  required?: boolean
}

export type CountryFieldBlock = {
  blockType: 'countryField'
  id?: string
  label: string
  helpText?: string
  required?: boolean
  multiple?: boolean
}

export type HeadingFieldBlock = {
  blockType: 'headingField'
  id?: string
  text: string
  level?: 'h2' | 'h3' | 'h4'
}

export type ParagraphFieldBlock = {
  blockType: 'paragraphField'
  id?: string
  text: string
}

export type DividerFieldBlock = {
  blockType: 'dividerField'
  id?: string
}

// Union of all block types — extend this when adding new field types
export type FormFieldBlock =
  | TextFieldBlock
  | TextareaFieldBlock
  | EmailFieldBlock
  | PhoneFieldBlock
  | NumberFieldBlock
  | DateFieldBlock
  | SelectFieldBlock
  | RadioFieldBlock
  | CheckboxFieldBlock
  | CheckboxGroupFieldBlock
  | FileFieldBlock
  | UrlFieldBlock
  | CountryFieldBlock
  | HeadingFieldBlock
  | ParagraphFieldBlock
  | DividerFieldBlock

// The value stored per dynamic answer
export type AnswerEntry = {
  blockType: string
  fieldLabel: string
  value: string
}
