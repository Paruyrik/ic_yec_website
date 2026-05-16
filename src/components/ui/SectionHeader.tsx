import React from 'react'

type Props = {
  label?: string
  title: React.ReactNode
  linkHref?: string
  linkText?: string
}

export function SectionHeader({ label, title, linkHref, linkText }: Props) {
  return (
    <div className="section-header">
      <div>
        {label && <p className="section-header__label">{label}</p>}
        <h2 className="section-header__title">{title}</h2>
      </div>
      {linkHref && linkText && (
        <a href={linkHref} className="section-header__link">
          {linkText} →
        </a>
      )}
    </div>
  )
}
