import { Badge } from '@/components/ui/badge'
import UpdateProfileForm from './update-profile-form'
import ChangePasswordForm from './change-password-form'
import { Locale } from '@/configs/locale.configs'
import { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import configEnv from '@/configs/env.configs'

type Props = {
  params: Promise<{ locale: Locale }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params;
  const t = await getTranslations({
    locale: params.locale,
    namespace: 'Setting'
  })

  const url = configEnv.NEXT_PUBLIC_URL + `/${params.locale}/manage/setting`

  return {
    title: t('title'),
    description: t('description'),
    alternates: {
      canonical: url
    },
    robots: {
      index: false
    }
  }
}

export default function Setting() {
  return (
    <main className='grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8'>
      <div className='mx-auto grid w-full flex-1 auto-rows-max gap-4'>
        <div className='flex items-center gap-4'>
          <h1 className='flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0'>Cài đặt</h1>
          <Badge variant='outline' className='ml-auto sm:ml-0'>
            Owner
          </Badge>
        </div>
        <div className='grid gap-4 md:grid-cols-2 md:gap-8'>
          <UpdateProfileForm />
          <ChangePasswordForm />
        </div>
      </div>
    </main>
  )
}
