'use client'
import Image from 'next/image'
import { Minus, Plus } from 'lucide-react'
import { useGetDishesQuery } from '@/queries/dish.queries'
import { formatCurrency } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import clsx from 'clsx'

export default function MenuOrder() {
    const { data } = useGetDishesQuery()
    const dishes = data?.payload.data ?? []

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
                                    {formatCurrency(dish.price)}
                                </p>
                            </div>
                        </div>
                        <div className='flex-shrink-0 ml-auto flex justify-center items-center'>
                            <div className='flex gap-1'>
                                <Button className='h-6 w-6 p-0'>
                                    <Minus className='w-3 h-3' />
                                </Button>
                                <Input type='text' readOnly className='h-6 p-1 w-8' />
                                <Button className='h-6 w-6 p-0'>
                                    <Plus className='w-3 h-3' />
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
            <div className='fixed bottom-0'>
                <Button className='w-full justify-between'>
                    <span>Giỏ hàng · 2 món</span>
                    <span>100,000 đ</span>
                </Button>
            </div>
        </>
    )
}