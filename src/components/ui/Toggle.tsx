'use client'

import { useState } from 'react'

type Props = {
  checked?: boolean
  defaultChecked?: boolean
  onChange?: (checked: boolean) => void
  label?: string
  disabled?: boolean
}

export function Toggle({ checked, defaultChecked = false, onChange, label, disabled }: Props) {
  const [internal, setInternal] = useState(defaultChecked)
  const isControlled = checked !== undefined
  const isOn = isControlled ? checked : internal

  function handleClick() {
    if (disabled) return
    const next = !isOn
    if (!isControlled) setInternal(next)
    onChange?.(next)
  }

  return (
    <label className={`inline-flex items-center gap-2.5 ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}>
      <button
        type="button"
        role="switch"
        aria-checked={isOn}
        onClick={handleClick}
        disabled={disabled}
        className={`
          relative w-10 h-6 rounded-full transition-colors duration-200 focus-visible:outline-none
          focus-visible:ring-2 focus-visible:ring-ic-purple focus-visible:ring-offset-1
          ${isOn ? 'bg-ic-purple' : 'bg-gray-200'}
        `}
      >
        <span
          className={`
            absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-sm
            transition-transform duration-200
            ${isOn ? 'translate-x-4' : 'translate-x-0'}
          `}
        />
      </button>
      {label && <span className="text-[14px] text-ic-dark select-none">{label}</span>}
    </label>
  )
}
