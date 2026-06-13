import {
  Body, Container, Head, Heading, Hr, Html, Img,
  Preview, Section, Text, Link,
} from '@react-email/components'
import * as React from 'react'

const BASE_URL = process.env.NEXT_PUBLIC_SERVER_URL ?? 'https://ic-yec.org'

type Props = {
  applicantName: string
  applicantEmail: string
  applicantCountry: string
  openCallTitle: string
  submittedAt: string
  adminUrl: string
}

export function InternalNotification({
  applicantName, applicantEmail, applicantCountry,
  openCallTitle, submittedAt, adminUrl,
}: Props) {
  return (
    <Html>
      <Head />
      <Preview>New application: {applicantName} - {openCallTitle}</Preview>
      <Body style={{ fontFamily: 'system-ui, sans-serif', background: '#F8F8FC', padding: '32px 0' }}>
        <Container style={{ background: 'white', borderRadius: 8, maxWidth: 560, margin: '0 auto', overflow: 'hidden' }}>
          <Section style={{ background: '#1A1833', padding: '20px 32px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <Img src={`${BASE_URL}/white-logo.png`} width="36" height="36" alt="IC-YEC" style={{ display: 'block' }} />
              <span style={{ color: 'white', fontSize: 15, fontWeight: 500, letterSpacing: '0.01em' }}>IC-YEC · New Registration</span>
            </div>
          </Section>
          <Section style={{ padding: '28px 32px' }}>
            <Heading style={{ fontSize: 20, fontWeight: 500, color: '#1A1833', marginBottom: 16 }}>
              New application received
            </Heading>
            {[
              ['Applicant',   applicantName],
              ['Email',       applicantEmail],
              ['Country',     applicantCountry],
              ['Open call',   openCallTitle],
              ['Submitted',   submittedAt],
            ].map(([label, value]) => (
              <Text key={label} style={{ color: '#1A1833', lineHeight: 1.6, margin: '4px 0' }}>
                <span style={{ color: '#6B6B8D', minWidth: 80, display: 'inline-block' }}>{label}:</span>{' '}
                <strong>{value}</strong>
              </Text>
            ))}
            <Hr style={{ borderColor: '#EEEDFE', margin: '20px 0' }} />
            <Link href={adminUrl} style={{
              display: 'inline-block', background: '#3D3785', color: 'white',
              padding: '10px 20px', borderRadius: 6, textDecoration: 'none', fontSize: 14,
            }}>
              Review in admin panel →
            </Link>
          </Section>
        </Container>
      </Body>
    </Html>
  )
}

export default InternalNotification
