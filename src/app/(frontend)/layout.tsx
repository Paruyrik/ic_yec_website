import React from 'react'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { CookieBanner } from '@/components/ui/CookieBanner'
import './styles.css'

export const metadata = {
  title: 'IC-YEC — International Center for Youth Empowerment Cooperation',
  description:
    'Erasmus+ accredited NGO supporting non-formal education, youth mobility, and European cooperation.',
  icons: {
    icon: '/YEC-circle.png',
    apple: '/YEC-circle.png',
  },
}

export default function FrontendLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <Header />
        <main style={{ flex: 1 }}>{children}</main>
        <Footer />
        <CookieBanner />
      </body>
    </html>
  )
}
