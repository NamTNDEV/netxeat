import type { Metadata } from 'next'
import { Inter as FontSans } from 'next/font/google'
import './globals.css'
import { cn } from '@/lib/utils'
import AppProvider from '@/providers/app-provider'

const fontSans = FontSans({
  subsets: ['latin'],
  variable: '--font-sans'
})
export const metadata: Metadata = {
  title: 'Big Boy Restaurant',
  description: 'The best restaurant in the world'
}

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang='en' suppressHydrationWarning>
      <body className={cn('min-h-screen bg-background font-sans antialiased', fontSans.variable)} data-gr-c-s-loaded='true'>
        <AppProvider>
          {children}
        </AppProvider>
      </body>
    </html>
  )
}
