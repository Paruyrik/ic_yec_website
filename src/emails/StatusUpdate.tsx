import {
  Body, Button, Container, Head, Heading, Hr, Html,
  Preview, Section, Text,
} from '@react-email/components'

type Decision = 'accepted' | 'rejected' | 'waitlisted'

type ContentEntry = {
  subject: string | ((title: string) => string)
  headline: string
  body: string | ((name: string, title: string, spots?: number) => string)
  cta?: { label: string; url: string } | ((baseUrl: string) => { label: string; url: string })
  accent: string
}

type Props = {
  applicantName: string
  openCallTitle: string
  decision: Decision
  notes?: string
  spotsAvailable?: number
}

const CONTENT: Record<Decision, ContentEntry> = {
  accepted: {
    subject: 'Congratulations — you have been accepted!',
    headline: '🎉 You have been accepted!',
    body: `We are delighted to inform you that your application has been selected. Our team will be in touch with the next steps, including practical information about the activity.`,
    accent: '#3B6D11',
  },
  waitlisted: {
    subject: 'Your application status update',
    headline: '⏳ You are on the waitlist',
    body: `Thank you for your application. You have been placed on our waitlist. We will contact you as soon as a spot becomes available. Please keep an eye on your inbox.`,
    accent: '#633806',
  },
  rejected: {
    subject: (title) => `Your application to ${title} — IC-YEC`,
    headline: 'Thank you for applying',
    body: (name, title, spots) => `Hi ${name},

Thank you for applying to ${title}. We had many applicants for only ${spots ?? 'a limited number of'} place${spots === 1 ? '' : 's'} — this was a genuinely difficult decision and not a reflection of the quality of your application.

We would love to see you apply to our upcoming activities. Your profile is exactly the kind we look for, and we hope to work with you soon.`,
    cta: (baseUrl) => ({ label: 'See current open calls', url: `${baseUrl}/open-calls` }),
    accent: '#A32D2D',
  },
}

export function StatusUpdate({ applicantName, openCallTitle, decision, notes, spotsAvailable }: Props) {
  const c = CONTENT[decision]
  const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL ?? ''

  const subject = typeof c.subject === 'function' ? c.subject(openCallTitle) : c.subject
  const body = typeof c.body === 'function' ? c.body(applicantName, openCallTitle, spotsAvailable) : c.body
  const cta = typeof c.cta === 'function' ? c.cta(baseUrl) : c.cta

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
            {decision !== 'rejected' && (
              <Text style={{ color: '#6B6B8D', lineHeight: 1.7 }}>Hi {applicantName},</Text>
            )}
            {decision !== 'rejected' && (
              <Text style={{ color: '#6B6B8D', lineHeight: 1.7 }}>
                Regarding your application to <strong style={{ color: '#1A1833' }}>{openCallTitle}</strong>:
              </Text>
            )}
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
              IC-YEC · International Center for Youth European Cooperation<br />
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  )
}

export default StatusUpdate
