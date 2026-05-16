import { getPayload } from 'payload'
import { notFound } from 'next/navigation'
import { headers as getHeaders } from 'next/headers'
import config from '@payload-config'
import DecisionDrawer from './DecisionDrawer'

export default async function RegistrationDecisionPage({ params }: { params: Promise<{ id: string }> }) {
  const { id }    = await params
  const payload   = await getPayload({ config: await config })
  const headersList = await getHeaders()

  // Auth check — must be logged-in admin
  const { user } = await payload.auth({ headers: headersList })
  if (!user) return notFound()

  const reg = await payload.findByID({ collection: 'registrations', id, depth: 2 }).catch(() => null)
  if (!reg) return notFound()

  const openCall    = reg.openCall as any
  const callTitle   = typeof openCall?.title === 'string' ? openCall.title : openCall?.title?.en ?? 'Open Call'
  const dob         = reg.dateOfBirth ? new Date(reg.dateOfBirth as string) : null
  const age         = dob ? Math.floor((Date.now() - dob.getTime()) / 31_557_600_000) : null
  const cvUrl       = reg.cv && typeof reg.cv === 'object' ? (reg.cv as any).url : null
  const submittedAt = new Date(reg.createdAt as string).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })

  return (
    <DecisionDrawer
      registration={{
        id: String(reg.id),
        applicantName: reg.applicantName,
        email:         reg.email,
        country:       reg.country,
        age,
        status:        reg.status as string,
        openCallTitle: callTitle,
        openCallId:    String(openCall?.id ?? ''),
        submittedAt,
        cvUrl,
        notes:         reg.notes ?? '',
        motivationLetter: reg.motivationLetter ?? '',
      }}
    />
  )
}
