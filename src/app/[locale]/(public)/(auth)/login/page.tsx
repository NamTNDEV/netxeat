import { getTranslations, setRequestLocale } from 'next-intl/server'
import LoginForm from './login-form'
import { Locale } from '@/configs/locale.configs'
import configEnv from '@/configs/env.configs'
import { htmlToTextForDescription } from '@/lib/utils'

export async function generateMetadata(props: {
  params: Promise<{ locale: Locale }>
}) {
  const params = await props.params

  const { locale } = params

  const t = await getTranslations({ locale, namespace: 'Login' })
  const url = configEnv.NEXT_PUBLIC_URL + `/${locale}/login`

  return {
    title: t('title'),
    description: htmlToTextForDescription(t('description')),
    alternates: {
      canonical: url
    }
  }
}

export default function Login({
  params: { locale }
}: {
  params: { locale: Locale }
}) {
  setRequestLocale(locale)
  return (
    <div className='min-h-screen flex items-center justify-center'>
      <LoginForm />
    </div>
  )
}
