import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'MedTrain — Doctor Training Chatbot',
  description: 'Interactive medical training chatbot for doctors and medical students',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
