import React from 'react'

type Props = {
  icon?: React.ReactNode
  title: string
  description?: string
  action?: React.ReactNode
}

export function EmptyState({ icon, title, description, action }: Props) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
      {icon && (
        <div className="text-[48px] mb-4 opacity-40">{icon}</div>
      )}
      <h3 className="text-[18px] font-medium text-ic-dark">{title}</h3>
      {description && (
        <p className="mt-2 text-[14px] text-[#6B6B8D] max-w-sm leading-relaxed">{description}</p>
      )}
      {action && <div className="mt-6">{action}</div>}
    </div>
  )
}
