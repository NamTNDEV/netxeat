import type { Metadata } from 'next'
import { Inter as FontSans } from 'next/font/google'
import './globals.css'
import { cn } from '@/lib/utils'
import AppProvider from '@/providers/app-provider'
import { NextIntlClientProvider } from 'next-intl'
import { routing } from '@/i18n/routing'
import { setRequestLocale } from 'next-intl/server'
import { Locale } from '@/configs/locale.configs'

const fontSans = FontSans({
  subsets: ['latin'],
  variable: '--font-sans'
})
export const metadata: Metadata = {
  title: 'NetxEat Restaurant',
  description: 'The best restaurant in the world'
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function RootLayout({
  params: {
    locale
  },
  children
}: Readonly<{
  params: { locale: Locale }
  children: React.ReactNode
}>) {
  setRequestLocale(locale);
  // if (!hasLocale(routing.locales, locale)) {
  //   notFound();
  // }
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
