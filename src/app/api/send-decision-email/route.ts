import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import { Resend } from 'resend'
import { render } from '@react-email/components'
import config from '@/payload.config'
import { StatusUpdate } from '@/emails/StatusUpdate'

const FROM_DEFAULT = 'IC-YEC <noreply@ic-yec.org>'
const CC_DEFAULT = 'projects.icyec@gmail.com'

export async function POST(req: NextRequest) {
  const resend = new Resend(process.env.RESEND_API_KEY)
  const FROM   = process.env.EMAIL_FROM ?? FROM_DEFAULT
  const { registrationId, decision, ccCoordinator } = await req.json()

  if (!registrationId || !decision) {
    return NextResponse.json({ error: 'registrationId and decision are required' }, { status: 400 })
  }

  const payload = await getPayload({ config: await config })

  // Fetch registration + linked open call
  const reg = await payload.findByID({ collection: 'registrations', id: registrationId })
    .catch(() => null)

  if (!reg) return NextResponse.json({ error: 'Registration not found' }, { status: 404 })

  const openCallId = typeof reg.openCall === 'object' ? (reg.openCall as any).id : reg.openCall
  const openCall   = await payload.findByID({ collection: 'open-calls', id: openCallId }).catch(() => null)
  const callTitle  = typeof openCall?.title === 'string' ? openCall.title : (openCall?.title as any)?.en ?? 'Open Call'

  const subject: Record<string, string> = {
    accepted:   `Congratulations — you've been accepted to ${callTitle}`,
    waitlisted: `Your application to ${callTitle} — waitlist update`,
    rejected:   `Your application to ${callTitle}`,
  }

  const html = await render(StatusUpdate({
    applicantName: reg.applicantName,
    openCallTitle: callTitle,
    decision: decision as 'accepted' | 'rejected' | 'waitlisted',
  }))

  const cc = ccCoordinator ? [CC_DEFAULT] : undefined

  const { error } = await resend.emails.send({
    from: FROM,
    to:   reg.email,
    cc,
    subject: subject[decision] ?? `Application update — ${callTitle}`,
    html,
  })

  if (error) {
    console.error('[send-decision-email]', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
