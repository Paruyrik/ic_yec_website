import {
  Body, Button, Container, Head, Heading, Hr, Html,
  Preview, Section, Text,
} from '@react-email/components'

type Decision = 'accepted' | 'rejected' | 'interview'

type BodyOpts = {
  spots?: number
  meetLink?: string
  interviewDate?: string
  interviewTime?: string
  agreementUrl?: string
}

type ContentEntry = {
  subject: string | ((title: string) => string)
  headline: string
  body: string | ((name: string, title: string, opts?: BodyOpts) => string)
  cta?: (opts: BodyOpts) => { label: string; url: string } | undefined
  accent: string
}

type Props = {
  applicantName: string
  openCallTitle: string
  decision: Decision
  notes?: string
  spotsAvailable?: number
  meetLink?: string
  interviewDate?: string
  interviewTime?: string
  agreementUrl?: string
}

const CONTENT: Record<Decision, ContentEntry> = {
  accepted: {
    subject: (title) => `Congratulations — you have been accepted to ${title}!`,
    headline: '🎉 You have been accepted!',
    body: (name, title) => `Hi ${name},

We are delighted to inform you that your application to ${title} has been selected. Our team will be in touch shortly with practical information about the activity.

Please sign the participation agreement using the link below to confirm your place.`,
    cta: (opts) => opts.agreementUrl
      ? { label: 'Sign participation agreement', url: opts.agreementUrl }
      : undefined,
    accent: '#3B6D11',
  },
  interview: {
    subject: (title) => `Your application to ${title} — Interview invitation`,
    headline: '📅 You are invited for an interview',
    body: (name, title, opts) => `Hi ${name},

Thank you for applying to ${title}. We have reviewed your application and would like to invite you for a short online interview.

📅  ${opts?.interviewDate ?? ''}
🕐  ${opts?.interviewTime ?? ''}

The interview will last approximately 30 minutes. If you are unable to attend at this time, please reply to this email as soon as possible so we can reschedule.`,
    cta: (opts) => opts.meetLink ? { label: 'Join Google Meet', url: opts.meetLink } : undefined,
    accent: '#633806',
  },
  rejected: {
    subject: (title) => `Your application to ${title} — IC-YEC`,
    headline: 'Thank you for applying',
    body: (name, title, opts) => `Hi ${name},

Thank you for applying to ${title}. We had many applicants for only ${opts?.spots ?? 'a limited number of'} place${opts?.spots === 1 ? '' : 's'} — this was a genuinely difficult decision and not a reflection of the quality of your application.

We would love to see you apply to our upcoming activities. Your profile is exactly the kind we look for, and we hope to work with you soon.`,
    cta: () => {
      const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL ?? ''
      return { label: 'See current open calls', url: `${baseUrl}/open-calls` }
    },
    accent: '#A32D2D',
  },
}

export function StatusUpdate({
  applicantName, openCallTitle, decision, notes,
  spotsAvailable, meetLink, interviewDate, interviewTime, agreementUrl,
}: Props) {
  const c    = CONTENT[decision]
  const opts: BodyOpts = { spots: spotsAvailable, meetLink, interviewDate, interviewTime, agreementUrl }

  const subject = typeof c.subject === 'function' ? c.subject(openCallTitle) : c.subject
  const body    = typeof c.body === 'function' ? c.body(applicantName, openCallTitle, opts) : c.body
  const cta     = c.cta?.(opts)

  return (
    <Html>
      <Head />
      <Preview>{subject}</Preview>
      <Body style={{ fontFamily: 'system-ui, sans-serif', background: '#F8F8FC', padding: '32px 0' }}>
        <Container style={{ background: 'white', borderRadius: 8, maxWidth: 560, margin: '0 auto', overflow: 'hidden' }}>
          <Section style={{ background: '#3D3785', padding: '24px 32px' }}>
            <Heading style={{ color: 'white', margin: 0, fontSize: 20, fontWeight: 500 }}>IC-YEC</Heading>
          </Section>
          <Section style={{ padding: '32px' }}>
            <Heading style={{ fontSize: 22, fontWeight: 500, color: c.accent, marginBottom: 8 }}>
              {c.headline}
            </Heading>
            <Text style={{ color: '#6B6B8D', lineHeight: 1.7, whiteSpace: 'pre-line' }}>{body}</Text>
            {notes && (
              <Text style={{ color: '#6B6B8D', lineHeight: 1.7, fontStyle: 'italic', borderLeft: `3px solid ${c.accent}`, paddingLeft: 12 }}>
                {notes}
              </Text>
            )}
            {cta && (
              <Section style={{ textAlign: 'center', margin: '24px 0' }}>
                <Button
                  href={cta.url}
                  style={{ background: '#3D3785', color: 'white', padding: '12px 24px', borderRadius: 6, textDecoration: 'none', fontSize: 14 }}
                >
                  {cta.label}
                </Button>
              </Section>
            )}
            <Hr style={{ borderColor: '#EEEDFE', margin: '24px 0' }} />
            <Text style={{ color: '#6B6B8D', fontSize: 13, lineHeight: 1.6 }}>
              IC-YEC · International Center for Youth European Cooperation
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  )
}

export default StatusUpdate
