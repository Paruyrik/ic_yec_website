type Status = 'pending' | 'reviewing' | 'accepted' | 'rejected' | 'waitlisted' | 'open' | 'closed'

const STYLES: Record<Status, string> = {
  pending:    'bg-[#FAEEDA] text-[#633806]',
  reviewing:  'bg-[#E6F1FB] text-[#0C447C]',
  accepted:   'bg-[#EAF3DE] text-[#3B6D11]',
  rejected:   'bg-[#FCEBEB] text-[#A32D2D]',
  waitlisted: 'bg-ic-purple-tint text-[#3C3489]',
  open:       'bg-[#EAF3DE] text-[#3B6D11]',
  closed:     'bg-gray-100 text-gray-500',
}

const LABELS: Record<Status, string> = {
  pending:    'Pending',
  reviewing:  'Reviewing',
  accepted:   'Accepted',
  rejected:   'Rejected',
  waitlisted: 'Waitlisted',
  open:       'Open',
  closed:     'Closed',
}

export function StatusPill({ status }: { status: Status }) {
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[12px] font-medium ${STYLES[status]}`}>
      {LABELS[status]}
    </span>
  )
}
