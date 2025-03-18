import orderApiServices from '@/api/services/orderApi.services'
import { UpdateOrderBodyType } from '@/schemaValidations/order.schema'
import { useMutation, useQuery } from '@tanstack/react-query'

export const useUpdateOrderMutation = () => {
    return useMutation({
        mutationFn: ({
            orderId,
            ...body
        }: UpdateOrderBodyType & {
            orderId: number
        }) => orderApiServices.updateOrder(orderId, body)
    })
}

export const useGetOrderListQuery = () => {
    return useQuery({
        queryFn: orderApiServices.getOrderList,
        queryKey: ['order-list']
    })
}