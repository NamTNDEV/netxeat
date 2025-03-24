import { setRequestLocale } from 'next-intl/server'
import LoginForm from './login-form'
import { Locale } from '@/configs/locale.configs'

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
