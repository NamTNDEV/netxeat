import type { Metadata } from 'next'
import { Inter as FontSans } from 'next/font/google'
import './globals.css'
import { cn } from '@/lib/utils'
import AppProvider from '@/providers/app-provider'
import { getLocale } from 'next-intl/server'
import { NextIntlClientProvider } from 'next-intl'

const fontSans = FontSans({
  subsets: ['latin'],
  variable: '--font-sans'
})
export const metadata: Metadata = {
  title: 'NetxEat Restaurant',
  description: 'The best restaurant in the world'
}

export default async function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  const locale = await getLocale();

  return (
    <html lang={locale} suppressHydrationWarning>
      <body className={cn('min-h-screen bg-background font-sans antialiased', fontSans.variable)} data-gr-c-s-loaded='true'>
        <NextIntlClientProvider>
          <AppProvider>
            {children}
          </AppProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
