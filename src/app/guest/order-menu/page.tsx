'use client'
import Image from 'next/image'
import { useGetDishesQuery } from '@/queries/dish.queries'
import { formatCurrency } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import clsx from 'clsx'
import OrderQuantity from './order-quantity'
import { useMemo, useState } from 'react'
import { GuestCreateOrdersBodyType } from '@/schemaValidations/guest.schema'

export default function OrderMenu() {
    const { data } = useGetDishesQuery()
    const dishes = useMemo(() => {
        return data?.payload.data ?? []
    }, [data])
    const [order, setOrder] = useState<GuestCreateOrdersBodyType>([])

    const handleChangeOrderItemQuantity = (dishId: number, quantity: number) => {
        setOrder((prevOrder) => {
            if (quantity === 0) return prevOrder.filter(order => order.dishId !== dishId)
            const orderItemIndex = prevOrder.findIndex(order => order.dishId === dishId)
            if (orderItemIndex === -1) {
                return [...prevOrder, { dishId, quantity }]
            }
            const newOrder = [...prevOrder]
            newOrder[orderItemIndex].quantity = quantity
            return newOrder
        })
    }

    const totalPrices = useMemo(() => {
        return order.reduce((acc, order) => {
            const dish = dishes.find(dish => dish.id === order.dishId)
            if (!dish) return acc
            return acc + dish.price * order.quantity
        }, 0)
    }, [order])

    return (
        <>
            {dishes.map((dish, index) => (
                <div key={dish.id}>
                    {index > 0 && <Separator orientation="horizontal" />}
                    <div className={clsx('flex gap-4', {
                        'pt-4': index > 0
                    })}>
                        <div className='flex-shrink-0'>
                            <Image
                                src={dish.image}
                                alt={dish.name}
                                height={100}
                                width={100}
                                quality={100}
                                className='object-cover w-[80px] h-[80px] rounded-md'
                            />
                        </div>
                        <div className='space-y-2'>
                            <div className='space-y-1'>
                                <h3 className='text-sm font-bold line-clamp-3'>{dish.name}</h3>
                                <p className='text-xs line-clamp-5'>- {dish.description}</p>
                            </div>
                            <div>
                                <p className='text-sm font-bold'>
                                    {(dish.price)}
                                </p>
                            </div>
                        </div>
                        <div className='flex-shrink-0 ml-auto flex justify-center items-center'>
                            <OrderQuantity
                                value={order.find(order => order.dishId === dish.id)?.quantity ?? 0}
                                onChange={(value) => handleChangeOrderItemQuantity(dish.id, value)}
                            />
                        </div>
                    </div>
                </div>
            ))}
            <div className='sticky bottom-0'>
                <Button className='w-full justify-between'>
                    <span>Giỏ hàng · {order.length} món</span>
                    <span>{formatCurrency(totalPrices)}</span>
                </Button>
            </div>
        </>
    )
}