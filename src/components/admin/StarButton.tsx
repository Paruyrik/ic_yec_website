'use client'

type Props = {
  active: boolean
  onClick: (e: React.MouseEvent) => void
}

export function StarButton({ active, onClick }: Props) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={active ? 'Remove from favourites' : 'Add to favourites'}
      className="p-1 rounded transition-colors hover:bg-[#FAEEDA]"
      style={{ color: active ? '#D97706' : '#C5C5D8', fontSize: 16, lineHeight: 1 }}
    >
      {active ? '★' : '☆'}
    </button>
  )
}
