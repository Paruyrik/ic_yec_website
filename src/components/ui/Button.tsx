import React from 'react'

type Variant = 'primary' | 'outline' | 'ghost' | 'danger' | 'success'
type Size = 'sm' | 'md' | 'lg'

const VARIANT_CLASSES: Record<Variant, string> = {
  primary: 'bg-ic-coral text-white hover:bg-ic-coral-dark',
  outline: 'bg-transparent text-ic-purple border border-ic-purple hover:bg-ic-purple-tint',
  ghost:   'bg-transparent text-ic-purple hover:bg-ic-purple-tint',
  danger:  'bg-[#FCEBEB] text-[#A32D2D] hover:bg-[#f5d5d5]',
  success: 'bg-[#EAF3DE] text-[#3B6D11] hover:bg-[#d4eabf]',
}

const SIZE_CLASSES: Record<Size, string> = {
  sm: 'px-3 py-1.5 text-[13px] gap-1.5',
  md: 'px-5 py-2.5 text-[14px] gap-2',
  lg: 'px-7 py-3 text-[15px] gap-2.5',
}

type Props = {
  variant?: Variant
  size?: Size
  loading?: boolean
  icon?: React.ReactNode
  children?: React.ReactNode
  disabled?: boolean
  type?: 'button' | 'submit' | 'reset'
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void
  className?: string
}

export function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  icon,
  children,
  disabled,
  type = 'button',
  onClick,
  className = '',
}: Props) {
  const isDisabled = disabled || loading

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={isDisabled}
      className={`
        inline-flex items-center justify-center font-medium rounded-lg
        transition-all duration-150 whitespace-nowrap select-none
        disabled:opacity-50 disabled:cursor-not-allowed
        hover:-translate-y-px active:translate-y-0
        ${VARIANT_CLASSES[variant]} ${SIZE_CLASSES[size]} ${className}
      `}
    >
      {loading ? (
        <svg className="animate-spin h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      ) : icon ? (
        <span className="shrink-0">{icon}</span>
      ) : null}
      {children}
    </button>
  )
}
