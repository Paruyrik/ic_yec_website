import { NextRequest, NextResponse } from 'next/server'
import { google } from 'googleapis'
import { getPayload } from 'payload'
import { render } from '@react-email/components'
import config from '@/payload.config'
import { StatusUpdate } from '@/emails/StatusUpdate'
import { sendEmail } from '@/lib/email'

const FROM_DEFAULT = 'IC-YEC <noreply@ic-yec.org>'
const CC_DEFAULT   = 'projects.icyec@gmail.com'

function getOAuthClient() {
  const client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    'http://localhost:3333',
  )
  client.setCredentials({ refresh_token: process.env.GOOGLE_REFRESH_TOKEN })
  return client
}

export async function POST(req: NextRequest) {
  const FROM = process.env.EMAIL_FROM ?? FROM_DEFAULT
  const { registrationId, interviewDate, interviewTime, ccCoordinator } = await req.json()

  if (!registrationId || !interviewDate || !interviewTime) {
    return NextResponse.json(
      { error: 'registrationId, interviewDate and interviewTime are required' },
      { status: 400 },
    )
  }

  const payload = await getPayload({ config: await config })
  const reg = await payload.findByID({ collection: 'registrations', id: registrationId, depth: 2 }).catch(() => null)
  if (!reg) return NextResponse.json({ error: 'Registration not found' }, { status: 404 })

  const openCall  = reg.openCall as any
  const callTitle = typeof openCall?.title === 'string' ? openCall.title : openCall?.title?.en ?? 'Open Call'

  // ── Create Google Calendar event with Meet ──────────────────────────────────
  const auth     = getOAuthClient()
  const calendar = google.calendar({ version: 'v3', auth })

  const startDT = new Date(`${interviewDate}T${interviewTime}:00`)
  const endDT   = new Date(startDT.getTime() + 30 * 60 * 1000)

  const event = await calendar.events.insert({
    calendarId: 'primary',
    conferenceDataVersion: 1,
    requestBody: {
      summary:     `IC-YEC Interview - ${reg.applicantName}`,
      description: `Interview for: ${callTitle}`,
      start: { dateTime: startDT.toISOString(), timeZone: 'UTC' },
      end:   { dateTime: endDT.toISOString(),   timeZone: 'UTC' },
      conferenceData: {
        createRequest: {
          requestId: `icyec-${registrationId}-${Date.now()}`,
          conferenceSolutionKey: { type: 'hangoutsMeet' },
        },
      },
      attendees: [{ email: reg.email }],
    },
  })

  const meetLink = event.data.conferenceData?.entryPoints?.find(
    (e) => e.entryPointType === 'video',
  )?.uri

  if (!meetLink) {
    return NextResponse.json({ error: 'Google Meet link was not generated' }, { status: 500 })
  }

  // ── Update registration status ──────────────────────────────────────────────
  await payload.update({
    collection: 'registrations',
    id: registrationId,
    data: { status: 'interview' },
  })

  // ── Send email ──────────────────────────────────────────────────────────────
  const formattedDate = startDT.toLocaleDateString('en-GB', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  })
  const formattedTime = startDT.toLocaleTimeString('en-GB', {
    hour: '2-digit', minute: '2-digit', timeZone: 'UTC',
  }) + ' UTC'

  const html = await render(
    StatusUpdate({
      applicantName: reg.applicantName,
      openCallTitle: callTitle,
      decision:      'interview',
      meetLink,
      interviewDate: formattedDate,
      interviewTime: formattedTime,
    }),
  )

  try {
    await sendEmail({
      from:    FROM,
      to:      reg.email,
      cc:      ccCoordinator ? [CC_DEFAULT] : undefined,
      subject: `Your application to ${callTitle} - Interview invitation`,
      html,
    })
  } catch (err: any) {
    console.error('[schedule-interview]', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }

  return NextResponse.json({ ok: true, meetLink })
}
