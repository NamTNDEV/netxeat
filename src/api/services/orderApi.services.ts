import http from '@/lib/http'
import {
    GetOrderDetailResType,
    GetOrdersQueryParamsType,
    GetOrdersResType,
    PayGuestOrdersBodyType,
    PayGuestOrdersResType,
    UpdateOrderBodyType,
    UpdateOrderResType
} from '@/schemaValidations/order.schema'
import queryString from 'query-string'

const prefix = "/orders";

const orderApiServices = {
    getOrderList: (queryParams: GetOrdersQueryParamsType) => http.get<GetOrdersResType>(`${prefix}?${queryString.stringify({
        fromDate: queryParams.fromDate?.toISOString(),
        toDate: queryParams.toDate?.toISOString(),
    })}`),
    getOrderDetail: (orderId: number) =>
        http.get<GetOrderDetailResType>(`${prefix}/${orderId}`),
    updateOrder: (orderId: number, body: UpdateOrderBodyType) =>
        http.put<UpdateOrderResType>(`${prefix}/${orderId}`, body),
    pay: (body: PayGuestOrdersBodyType) =>
        http.post<PayGuestOrdersResType>(`${prefix}/pay`, body)
}

export default orderApiServices