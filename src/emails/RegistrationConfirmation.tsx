import {
  Body, Container, Head, Heading, Hr, Html, Img,
  Preview, Section, Text,
} from '@react-email/components'
import * as React from 'react'

const BASE_URL = process.env.NEXT_PUBLIC_SERVER_URL ?? 'https://ic-yec.org'

type Props = {
  applicantName: string
  openCallTitle: string
  submittedAt?: string
}

export function RegistrationConfirmation({ applicantName, openCallTitle, submittedAt }: Props) {
  return (
    <Html>
      <Head />
      <Preview>Your application to {openCallTitle} has been received</Preview>
      <Body style={{ fontFamily: 'system-ui, sans-serif', background: '#F8F8FC', padding: '32px 0' }}>
        <Container style={{ background: 'white', borderRadius: 8, maxWidth: 560, margin: '0 auto', overflow: 'hidden' }}>
          <Section style={{ background: '#3D3785', padding: '20px 32px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <Img src={`${BASE_URL}/white-logo.png`} width="40" height="40" alt="IC-YEC" style={{ display: 'block' }} />
              <span style={{ color: 'white', fontSize: 17, fontWeight: 500, letterSpacing: '0.01em' }}>IC-YEC</span>
            </div>
          </Section>
          <Section style={{ padding: '32px' }}>
            <Heading style={{ fontSize: 22, fontWeight: 500, color: '#1A1833', marginBottom: 8 }}>
              Application received ✓
            </Heading>
            <Text style={{ color: '#6B6B8D', lineHeight: 1.7 }}>
              Hi {applicantName},
            </Text>
            <Text style={{ color: '#6B6B8D', lineHeight: 1.7 }}>
              Thank you for applying to <strong style={{ color: '#1A1833' }}>{openCallTitle}</strong>.
              We have received your application{submittedAt ? ` on ${submittedAt}` : ''} and our team
              will review it carefully.
            </Text>
            <Text style={{ color: '#6B6B8D', lineHeight: 1.7 }}>
              You can expect to hear back from us within <strong style={{ color: '#1A1833' }}>two weeks</strong>.
              If you have any questions in the meantime, reply to this email.
            </Text>
            <Hr style={{ borderColor: '#EEEDFE', margin: '24px 0' }} />
            <Text style={{ color: '#6B6B8D', fontSize: 13, lineHeight: 1.6 }}>
              IC-YEC · International Center for Youth Empowerment Cooperation<br />
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  )
}

export default RegistrationConfirmation
