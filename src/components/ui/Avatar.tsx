const PALETTE = [
  'bg-ic-purple-tint text-ic-purple',
  'bg-[#EAF3DE] text-[#3B6D11]',
  'bg-[#FAEEDA] text-[#633806]',
  'bg-[#E6F1FB] text-[#0C447C]',
  'bg-[#FAECE7] text-[#993C1D]',
  'bg-[#FCEBEB] text-[#A32D2D]',
]

function colorFor(name: string) {
  let hash = 0
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash)
  return PALETTE[Math.abs(hash) % PALETTE.length]
}

function initials(name: string) {
  const parts = name.trim().split(/\s+/)
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

type Size = 'sm' | 'md' | 'lg' | 'xl'

const SIZE_CLASSES: Record<Size, string> = {
  sm: 'w-7 h-7 text-[11px]',
  md: 'w-9 h-9 text-[13px]',
  lg: 'w-12 h-12 text-[16px]',
  xl: 'w-16 h-16 text-[20px]',
}

type Props = {
  name: string
  src?: string | null
  size?: Size
  className?: string
}

export function Avatar({ name, src, size = 'md', className = '' }: Props) {
  if (src) {
    return (
      <img
        src={src}
        alt={name}
        className={`rounded-full object-cover shrink-0 ${SIZE_CLASSES[size]} ${className}`}
      />
    )
  }

  return (
    <span
      className={`
        inline-flex items-center justify-center rounded-full font-medium shrink-0
        ${colorFor(name)} ${SIZE_CLASSES[size]} ${className}
      `}
      aria-label={name}
    >
      {initials(name)}
    </span>
  )
}
