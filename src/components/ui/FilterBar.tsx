'use client'

import React from 'react'

type FilterOption = { label: string; value: string }

type Props = {
  filters: {
    key: string
    label: string
    options: FilterOption[]
    value: string
    onChange: (value: string) => void
  }[]
  search?: {
    value: string
    onChange: (value: string) => void
    placeholder?: string
  }
  count?: number
  countLabel?: string
}

export function FilterBar({ filters, search, count, countLabel = 'results' }: Props) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      {search && (
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6B6B8D] pointer-events-none text-[15px]">
            🔍
          </span>
          <input
            type="search"
            value={search.value}
            onChange={(e) => search.onChange(e.target.value)}
            placeholder={search.placeholder ?? 'Search…'}
            className="
              pl-9 pr-4 py-2 rounded-lg border border-[#E2E1F5] bg-white
              text-[14px] text-ic-dark placeholder:text-[#6B6B8D]
              focus:outline-none focus:ring-2 focus:ring-ic-purple focus:border-transparent
              w-52
            "
          />
        </div>
      )}

      {filters.map((f) => (
        <select
          key={f.key}
          value={f.value}
          onChange={(e) => f.onChange(e.target.value)}
          className="
            px-3 py-2 rounded-lg border border-[#E2E1F5] bg-white
            text-[14px] text-ic-dark
            focus:outline-none focus:ring-2 focus:ring-ic-purple focus:border-transparent
            cursor-pointer
          "
          aria-label={f.label}
        >
          <option value="">{f.label}</option>
          {f.options.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      ))}

      {count !== undefined && (
        <span className="ml-auto text-[13px] text-[#6B6B8D] shrink-0">
          {count} {countLabel}
        </span>
      )}
    </div>
  )
}
