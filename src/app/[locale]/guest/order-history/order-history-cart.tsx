"use client"

import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { formatCurrency, getVietnameseOrderStatus } from "@/lib/utils"
import { useGuestGetOrderListQuery } from "@/queries/guest.queries"
import { Clock, Package } from "lucide-react"
import Image from "next/image"
import { useEffect, useMemo } from "react"
import { motion } from "framer-motion"
import { OrderStatus } from "@/constants/type"
import { PayGuestOrdersResType, UpdateOrderResType } from "@/schemaValidations/order.schema"
import { toast } from "sonner"
import { useSocketStore } from "@/stores/socket.stores"

// Hàm helper để xác định màu sắc của badge dựa trên trạng thái
const getStatusColor = (status: string) => {
    switch (status) {
        case OrderStatus.Delivered:
            return "bg-green-100 text-green-800 border-green-200"
        case OrderStatus.Paid:
            return "bg-yellow-100 text-yellow-800 border-yellow-200"
        case OrderStatus.Processing:
            return "bg-blue-100 text-blue-800 border-blue-200"
        case OrderStatus.Rejected:
            return "bg-red-100 text-red-800 border-red-200"
        default:
            return "bg-gray-100 text-gray-800 border-gray-200"
    }
}

// Component hiển thị một đơn hàng
const OrderItem = ({ order, index }: { order: any; index: number }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
        >
            <Card className="p-4 mb-3 hover:shadow-md transition-all duration-200 border border-gray-100">
                <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 relative">
                        <div className="absolute -left-2 -top-2 w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center text-xs font-medium dark:bg-slate-800">
                            {index + 1}
                        </div>
                        <Image
                            src={order.dishSnapshot.image || "/placeholder.svg"}
                            alt={order.dishSnapshot.name}
                            height={100}
                            width={100}
                            quality={80}
                            loading="lazy"
                            className="object-cover w-[90px] h-[90px] rounded-lg"
                        />
                    </div>

                    <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start">
                            <h3 className="font-medium text-base line-clamp-2">{order.dishSnapshot.name}</h3>
                            <Badge variant="outline" className={`ml-2 flex-shrink-0 ${getStatusColor(order.status)}`}>
                                {getVietnameseOrderStatus(order.status)}
                            </Badge>
                        </div>

                        <div className="mt-2 flex items-center text-sm text-gray-600">
                            <Package className="w-4 h-4 mr-1" />
                            <span className="font-medium text-gray-900 dark:text-white">{formatCurrency(order.dishSnapshot.price)}</span>
                            <span className="mx-1">×</span>
                            <Badge variant="secondary" className="px-2 py-0">
                                {order.quantity}
                            </Badge>
                        </div>

                        {/* <div className="mt-1 text-xs text-gray-500 flex items-center">
                            <Clock className="w-3 h-3 mr-1" />
                            <span>{new Date().toLocaleDateString("vi-VN")}</span>
                        </div> */}
                    </div>
                </div>
            </Card>
        </motion.div>
    )
}

// Component chính
const OrderHistoryCart = () => {
    const { data, isLoading, refetch } = useGuestGetOrderListQuery()
    const orders = useMemo(() => data?.payload.data ?? [], [data])
    const { socket } = useSocketStore()

    const { waitingForPaying, paid } = useMemo(() => {
        return orders.reduce(
            (result, order) => {
                if (
                    order.status === OrderStatus.Delivered ||
                    order.status === OrderStatus.Processing ||
                    order.status === OrderStatus.Pending
                ) {
                    return {
                        ...result,
                        waitingForPaying: {
                            price:
                                result.waitingForPaying.price +
                                order.dishSnapshot.price * order.quantity,
                            quantity: result.waitingForPaying.quantity + order.quantity
                        }
                    }
                }
                if (order.status === OrderStatus.Paid) {
                    return {
                        ...result,
                        paid: {
                            price:
                                result.paid.price + order.dishSnapshot.price * order.quantity,
                            quantity: result.paid.quantity + order.quantity
                        }
                    }
                }
                return result
            },
            {
                waitingForPaying: {
                    price: 0,
                    quantity: 0
                },
                paid: {
                    price: 0,
                    quantity: 0
                }
            }
        )
    }, [orders])

    useEffect(() => {
        if (!socket) return
        function onUpdateOrder(data: UpdateOrderResType['data']) {
            const {
                dishSnapshot: { name },
                quantity
            } = data
            toast.success(
                `Món ${name} (SL: ${quantity}) vừa được cập nhật sang trạng thái "${getVietnameseOrderStatus(data.status)}"`
            )
            refetch()
        }

        function onPayment(data: PayGuestOrdersResType['data']) {
            const { guest } = data[0]
            toast.success(`${guest?.name} tại bàn ${guest?.tableNumber} thanh toán thành công ${data.length} đơn`)
            refetch()
        }

        socket.on('update-order', onUpdateOrder)
        socket.on('payment', onPayment)

        return () => {
            socket.off('update-order', onUpdateOrder)
            socket.off('payment', onPayment)
        }
    }, [refetch, socket])

    if (isLoading) {
        return (
            <div className="flex justify-center py-10">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
            </div>
        )
    }

    if (orders.length === 0) {
        return (
            <Card className="p-8 text-center">
                <div className="flex flex-col items-center justify-center space-y-3">
                    <Package className="w-12 h-12 text-gray-300" />
                    <h3 className="text-lg font-medium">Chưa có đơn hàng nào</h3>
                    <p className="text-sm text-gray-500">Các đơn hàng của bạn sẽ xuất hiện ở đây</p>
                </div>
            </Card>
        )
    }

    return (
        <div className="space-y-4">
            <div className="space-y-1">
                {orders.map((order, index) => (
                    <OrderItem key={order.id} order={order} index={index} />
                ))}
            </div>

            <Card className="sticky bottom-4 mt-4 p-4 bg-white border border-gray-200 shadow-lg dark:bg-slate-800">
                <div className="grid grid-cols-2 gap-6 text-gray-300">
                    {/* Chưa thanh toán */}
                    <div className="flex flex-col items-center">
                        <span className="text-sm text-gray-400">Chưa thanh toán</span>
                        <span className="text-lg font-bold text-yellow-400">
                            {waitingForPaying.quantity} món
                        </span>
                        <span className="text-xl font-bold text-yellow-500">
                            {formatCurrency(waitingForPaying.price)}
                        </span>
                    </div>

                    {/* Đã thanh toán */}
                    <div className="flex flex-col items-center">
                        <span className="text-sm text-gray-400">Đã thanh toán</span>
                        <span className="text-lg font-bold text-green-400">
                            {paid.quantity} món
                        </span>
                        <span className="text-xl font-bold text-green-500">
                            {formatCurrency(paid.price)}
                        </span>
                    </div>
                </div>
            </Card>
        </div>
    )
}

export default OrderHistoryCart

