import {
  Body, Container, Head, Heading, Hr, Html,
  Preview, Section, Text,
} from '@react-email/components'
import * as React from 'react'

type Decision = 'accepted' | 'rejected' | 'waitlisted'

type Props = {
  applicantName: string
  openCallTitle: string
  decision: Decision
  notes?: string
}

const CONTENT: Record<Decision, { subject: string; headline: string; body: string; accent: string }> = {
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
    subject: 'Your application — IC-YEC',
    headline: 'Application outcome',
    body: `Thank you for taking the time to apply. After careful review, we are unable to offer you a place in this particular activity. We encourage you to apply to our future open calls — we hope to work with you soon.`,
    accent: '#A32D2D',
  },
}

export function StatusUpdate({ applicantName, openCallTitle, decision, notes }: Props) {
  const c = CONTENT[decision]
  return (
    <Html>
      <Head />
      <Preview>{c.subject}</Preview>
      <Body style={{ fontFamily: 'system-ui, sans-serif', background: '#F8F8FC', padding: '32px 0' }}>
        <Container style={{ background: 'white', borderRadius: 8, maxWidth: 560, margin: '0 auto', overflow: 'hidden' }}>
          <Section style={{ background: '#3D3785', padding: '24px 32px' }}>
            <Heading style={{ color: 'white', margin: 0, fontSize: 20, fontWeight: 500 }}>IC-YEC</Heading>
          </Section>
          <Section style={{ padding: '32px' }}>
            <Heading style={{ fontSize: 22, fontWeight: 500, color: c.accent, marginBottom: 8 }}>
              {c.headline}
            </Heading>
            <Text style={{ color: '#6B6B8D', lineHeight: 1.7 }}>Hi {applicantName},</Text>
            <Text style={{ color: '#6B6B8D', lineHeight: 1.7 }}>
              Regarding your application to <strong style={{ color: '#1A1833' }}>{openCallTitle}</strong>:
            </Text>
            <Text style={{ color: '#6B6B8D', lineHeight: 1.7 }}>{c.body}</Text>
            {notes && (
              <Text style={{ color: '#6B6B8D', lineHeight: 1.7, fontStyle: 'italic', borderLeft: `3px solid ${c.accent}`, paddingLeft: 12 }}>
                {notes}
              </Text>
            )}
            <Hr style={{ borderColor: '#EEEDFE', margin: '24px 0' }} />
            <Text style={{ color: '#6B6B8D', fontSize: 13, lineHeight: 1.6 }}>
              IC-YEC · International Center for Youth European Cooperation<br />
              Erasmus+ Accredited NGO · PIC 887857394 · OID E10290520
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  )
}

export default StatusUpdate
