import React from 'react'

type Props = {
  children: React.ReactNode
  className?: string
  hover?: boolean
  padding?: 'none' | 'sm' | 'md' | 'lg'
  as?: 'div' | 'article' | 'section'
}

const PADDING: Record<NonNullable<Props['padding']>, string> = {
  none: '',
  sm:   'p-4',
  md:   'p-5',
  lg:   'p-6',
}

export function Card({ children, className = '', hover = false, padding = 'md', as: Tag = 'div' }: Props) {
  return (
    <Tag
      className={`
        bg-white rounded-xl shadow-card
        ${hover ? 'transition-all duration-200 hover:shadow-hover hover:-translate-y-0.5 cursor-pointer' : ''}
        ${PADDING[padding]}
        ${className}
      `}
    >
      {children}
    </Tag>
  )
}
