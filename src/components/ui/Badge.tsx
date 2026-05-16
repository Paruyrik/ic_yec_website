type Variant = 'art' | 'sport' | 'training' | 'inclusion' | 'digital' | 'environment'
type Size = 'sm' | 'md'

const VARIANT_CLASSES: Record<Variant, string> = {
  art:         'bg-ic-purple-tint text-ic-purple',
  sport:       'bg-[#EAF3DE] text-[#3B6D11]',
  training:    'bg-[#FEF3C7] text-[#92400E]',
  inclusion:   'bg-[#E6F1FB] text-[#0C447C]',
  digital:     'bg-ic-purple-tint text-ic-purple',
  environment: 'bg-[#EAF3DE] text-[#3B6D11]',
}

const SIZE_CLASSES: Record<Size, string> = {
  sm: 'px-2 py-0.5 text-[10px]',
  md: 'px-2.5 py-1 text-[11px]',
}

type Props = {
  variant: Variant
  size?: Size
  children?: React.ReactNode
}

export function Badge({ variant, size = 'md', children }: Props) {
  return (
    <span className={`
      inline-flex items-center rounded-full font-medium uppercase tracking-wide
      ${VARIANT_CLASSES[variant]} ${SIZE_CLASSES[size]}
    `}>
      {children ?? variant}
    </span>
  )
}
