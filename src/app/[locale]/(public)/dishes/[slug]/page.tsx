import { dishApiServices } from '@/api/services/dishApi.services'
import { executeApiRequest, generateSlugUrl, getIdFromSlug } from '@/lib/utils'
import DishDetail from './dish-detail'
import { Locale } from '@/configs/locale.configs'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { cache } from 'react'
import { Metadata } from 'next'
import configEnv from '@/configs/env.configs'
import { baseOpenGraph } from '@/shared-metadata'

const getDetail = cache((slug: string) =>
    executeApiRequest(() => dishApiServices.getDish(Number(getIdFromSlug(slug))))
)

type Props = {
    params: { slug: string; locale: Locale }
    searchParams: { [key: string]: string | string[] | undefined }
}

export async function generateMetadata({
    params,
    searchParams
}: Props): Promise<Metadata> {
    const { slug, locale } = params

    const t = await getTranslations({
        locale,
        namespace: 'DishDetail'
    })
    const data = await getDetail(slug)
    const dish = data?.payload.data
    if (!dish) {
        return {
            title: t('notFound'),
            description: t('notFound')
        }
    }
    const url =
        configEnv.NEXT_PUBLIC_URL +
        `/${locale}/dishes/${generateSlugUrl(dish.name, dish.id)}`

    return {
        title: dish.name,
        description: dish.description,
        openGraph: {
            ...baseOpenGraph,
            title: dish.name,
            description: dish.description,
            url,
            images: [
                {
                    url: dish.image,
                    alt: dish.name
                }
            ]
        },
        alternates: {
            canonical: url
        }
    }
}

export default async function DishPage({
    params: { slug, locale }
}: {
    params: {
        slug: string,
        locale: Locale
    }
}) {
    setRequestLocale(locale);
    // const data = await executeApiRequest(() => dishApiServices.getDish(Number(getIdFromSlug(slug))))
    const data = await getDetail(slug)
    const dish = data?.payload?.data
    if (!dish)
        return (
            <div className="flex justify-center items-center py-16">
                <h1 className="text-2xl lg:text-3xl font-semibold text-red-500">
                    Món ăn không tồn tại
                </h1>
            </div>
        )

    return (
        <div className="py-16 px-4 space-y-8 max-w-7xl mx-auto">
            <DishDetail dish={dish} />
        </div>
    )
}