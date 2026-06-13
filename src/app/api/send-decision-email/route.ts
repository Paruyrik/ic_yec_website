import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import { render } from '@react-email/components'
import config from '@/payload.config'
import { StatusUpdate } from '@/emails/StatusUpdate'
import { sendEmail } from '@/lib/email'

const FROM_DEFAULT = 'IC-YEC <noreply@ic-yec.org>'
const CC_DEFAULT   = 'projects.icyec@gmail.com'

export async function POST(req: NextRequest) {
  const FROM = process.env.EMAIL_FROM ?? FROM_DEFAULT
  const { registrationId, decision, ccCoordinator, agreementUrl } = await req.json()

  if (!registrationId || !decision) {
    return NextResponse.json({ error: 'registrationId and decision are required' }, { status: 400 })
  }

  const payload = await getPayload({ config: await config })

  const reg = await payload.findByID({ collection: 'registrations', id: registrationId }).catch(() => null)
  if (!reg) return NextResponse.json({ error: 'Registration not found' }, { status: 404 })

  const openCallId = typeof reg.openCall === 'object' ? (reg.openCall as any).id : reg.openCall
  const openCall   = await payload.findByID({ collection: 'open-calls', id: openCallId }).catch(() => null)
  const callTitle  = typeof openCall?.title === 'string' ? openCall.title : (openCall?.title as any)?.en ?? 'Open Call'

  const subject: Record<string, string> = {
    accepted: `Congratulations - you've been accepted to ${callTitle}`,
    rejected: `Your application to ${callTitle}`,
  }

  const html = await render(StatusUpdate({
    applicantName: reg.applicantName,
    openCallTitle: callTitle,
    decision: decision as 'accepted' | 'rejected' | 'interview',
    agreementUrl: agreementUrl ?? undefined,
  }))

  try {
    await sendEmail({
      from:    FROM,
      to:      reg.email,
      cc:      ccCoordinator ? [CC_DEFAULT] : undefined,
      subject: subject[decision] ?? `Application update - ${callTitle}`,
      html,
    })
  } catch (err: any) {
    console.error('[send-decision-email]', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
