import configEnv from '@/configs/env.configs'
import { Locale } from '@/configs/locale.configs'
import { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import OrderMenu from './order-menu'

type Props = {
    params: Promise<{ locale: Locale }>
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export async function generateMetadata(props: Props): Promise<Metadata> {
    const params = await props.params;
    const t = await getTranslations({
        locale: params.locale,
        namespace: 'GuestMenu'
    })

    const url = configEnv.NEXT_PUBLIC_URL + `/${params.locale}/guest/order-menu`

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

export default async function MenuPage() {
    return (
        <div className='max-w-[400px] mx-auto space-y-4'>
            <h1 className='text-center text-xl font-bold'>🍕 Menu quán</h1>
            <OrderMenu />
        </div>
    )
}