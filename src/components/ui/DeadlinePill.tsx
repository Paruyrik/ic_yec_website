import { differenceInDays, format } from 'date-fns'

export function DeadlinePill({ deadline }: { deadline: Date }) {
  const days = differenceInDays(deadline, new Date())

  if (days < 0) {
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[12px] font-medium bg-gray-100 text-gray-500">
        Closed
      </span>
    )
  }

  if (days <= 30) {
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[12px] font-medium bg-[#FAECE7] text-[#993C1D]">
        {days === 0 ? 'Today' : `${days}d left`}
      </span>
    )
  }

  return (
    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[12px] font-medium bg-[#EAF3DE] text-[#3B6D11]">
      Closes {format(deadline, 'MMM d')}
    </span>
  )
}
