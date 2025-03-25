import { formatCurrency } from "@/lib/utils"
import { DishResType } from "@/schemaValidations/dish.schema"
import Image from "next/image"

const DishDetail = ({ dish }: { dish: DishResType['data'] | undefined }) => {

    if (!dish) return null
    return (
        <>
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
                    title={dish.name}
                    className="object-cover rounded-lg shadow-xl w-full max-w-[360px] h-[360px]"
                    priority
                />
            </div>

            {/* Mô tả món ăn */}
            <div className="space-y-4">
                <h2 className="text-xl lg:text-2xl font-semibold text-gray-700 dark:text-gray-400">Mô tả</h2>
                <p className="text-base text-gray-600">{dish.description}</p>
            </div>
        </>
    )
}

export default DishDetail