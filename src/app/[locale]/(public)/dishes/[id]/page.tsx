import { dishApiServices } from '@/api/services/dishApi.services'
import { formatCurrency, executeApiRequest } from '@/lib/utils'
import Image from 'next/image'
import DishDetail from './dish-detail'
import { Locale } from '@/configs/locale.configs'
import { setRequestLocale } from 'next-intl/server'

export default async function DishPage({
    params: { id, locale }
}: {
    params: {
        id: string,
        locale: Locale
    }
}) {
    setRequestLocale(locale);
    const data = await executeApiRequest(() => dishApiServices.getDish(Number(id)))

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