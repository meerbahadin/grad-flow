import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'GradeFlow - WebGL Gradient Backgrounds',
  description:
    'Create stunning animated gradient backgrounds with WebGL. Open-source React component with 60fps performance, customizable colors, noise effects,image export, and realtime controls. Perfect for modern web applications.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang='en'>
      <body className={`antialiased`}>{children}</body>
    </html>
  )
}
