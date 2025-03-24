'use client'
import { Minus, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface OrderQuantityProps {
    value: number
    onChange: (value: number) => void
}

const OrderQuantity = ({
    value,
    onChange
}: OrderQuantityProps) => {
    return (
        <div className='flex gap-1'>
            <Button
                className='h-6 w-6 p-0'
                onClick={() => {
                    if (value === 0) return
                    onChange(value - 1)
                }}
                disabled={value === 0}
            >
                <Minus className='w-3 h-3' />
            </Button>
            <Input
                type='text'
                value={value}
                pattern='[0-9]*'
                inputMode='numeric'
                className='h-6 p-1 w-8 text-xs text-center'
                onChange={(e) => {
                    const inputValue = e.target.value
                    if (isNaN(Number(inputValue))) return
                    onChange(Number(inputValue))
                }}
            />
            <Button
                className='h-6 w-6 p-0'
                onClick={() => onChange(value + 1)}
            >
                <Plus className='w-3 h-3' />
            </Button>
        </div>
    )
}

export default OrderQuantity