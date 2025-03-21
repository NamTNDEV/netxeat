import { dishApiServices } from '@/api/services/dishApi.services'
import { formatCurrency, executeApiRequest } from '@/lib/utils'
import Image from 'next/image'

export default async function DishPage({
    params: { id }
}: {
    params: {
        id: string
    }
}) {
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
            {/* Tên món ăn */}
            <h1 className="text-3xl lg:text-4xl font-bold text-center text-gray-900 dark:text-gray-400">{dish.name}</h1>

            {/* Giá sản phẩm */}
            <div className="text-xl lg:text-2xl font-semibold text-primary text-center">
                {formatCurrency(dish.price)}
            </div>

            {/* Hình ảnh sản phẩm */}
            <div className="flex justify-center">
                <Image
                    src={dish.image}
                    width={360}
                    height={360}
                    quality={100}
                    alt={dish.name}
                    className="object-cover rounded-lg shadow-xl w-full max-w-[360px] h-[360px]"
                    priority
                />
            </div>

            {/* Mô tả món ăn */}
            <div className="space-y-4">
                <h2 className="text-xl lg:text-2xl font-semibold text-gray-700 dark:text-gray-400">Mô tả</h2>
                <p className="text-base text-gray-600">{dish.description}</p>
            </div>
        </div>
    )
}