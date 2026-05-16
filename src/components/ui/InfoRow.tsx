import React from 'react'

type Props = {
  icon: React.ReactNode
  label: string
  value: React.ReactNode
}

export function InfoRow({ icon, label, value }: Props) {
  return (
    <div className="info-row">
      <span className="info-row__icon">{icon}</span>
      <div>
        <div className="info-row__label">{label}</div>
        <div className="info-row__value">{value}</div>
      </div>
    </div>
  )
}
