import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Line to Slack Survey',
  description: 'Help us understand your perspective on transitioning from Line to Slack',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body suppressHydrationWarning={true}>{children}</body>
    </html>
  )
}