import { Inter as FontSans } from 'next/font/google'
import './globals.css'
import { cn } from '@/lib/utils'
import AppProvider from '@/providers/app-provider'
import { NextIntlClientProvider } from 'next-intl'
import { routing } from '@/i18n/routing'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { Locale } from '@/configs/locale.configs'
import NextTopLoader from 'nextjs-toploader';
import Footer from '@/components/layouts/footer'

const fontSans = FontSans({
  subsets: ['latin'],
  variable: '--font-sans'
})

export async function generateMetadata(
  props: {
    params: Promise<{ locale: Locale }>
  }
) {
  const params = await props.params;

  const {
    locale
  } = params;

  const t = await getTranslations({ locale, namespace: 'Brand' })

  return {
    title: {
      template: `%s | ${t('title')}`,
      default: t('defaultTitle')
    }
  }
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function RootLayout(
  props: Readonly<{
    params: Promise<{ locale: Locale }>
    children: React.ReactNode
  }>
) {
  const params = await props.params;

  const {
    locale
  } = params;

  const {
    children
  } = props;

  setRequestLocale(locale);
  return (
    <html lang={locale} suppressHydrationWarning>
      <body className={cn('min-h-screen bg-background font-sans antialiased', fontSans.variable)} data-gr-c-s-loaded='true'>
        <NextTopLoader
          showSpinner={false}
          color='hsl(var(--foreground))'
        />
        <NextIntlClientProvider>
          <AppProvider>
            {children}
            <Footer />
          </AppProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
