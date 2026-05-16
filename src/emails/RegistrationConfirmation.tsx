import {
  Body, Container, Head, Heading, Hr, Html,
  Preview, Section, Text, Link,
} from '@react-email/components'
import * as React from 'react'

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
          <Section style={{ background: '#3D3785', padding: '24px 32px' }}>
            <Heading style={{ color: 'white', margin: 0, fontSize: 20, fontWeight: 500 }}>IC-YEC</Heading>
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
              IC-YEC · International Center for Youth European Cooperation<br />
              Erasmus+ Accredited NGO · PIC 887857394 · OID E10290520
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  )
}

export default RegistrationConfirmation
