import orderApiServices from '@/api/services/orderApi.services'
import { GetOrdersQueryParamsType, UpdateOrderBodyType } from '@/schemaValidations/order.schema'
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

export const useGetOrderListQuery = (queryParams: GetOrdersQueryParamsType) => {
    return useQuery({
        queryFn: () => orderApiServices.getOrderList(queryParams),
        queryKey: ['order-list', queryParams]
    })
}

export const useGetOrderQuery = (orderId: number | undefined) => {
    return useQuery({
        queryFn: () => orderApiServices.getOrderDetail(orderId as number),
        queryKey: ['order', orderId],
        enabled: Boolean(orderId)
    })
}