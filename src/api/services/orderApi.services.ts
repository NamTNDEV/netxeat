import http from '@/lib/http'
import {
    GetOrdersResType,
    UpdateOrderBodyType,
    UpdateOrderResType
} from '@/schemaValidations/order.schema'

const prefix = "/orders";

const orderApiServices = {
    getOrderList: () => http.get<GetOrdersResType>(`${prefix}`),
    updateOrder: (orderId: number, body: UpdateOrderBodyType) =>
        http.put<UpdateOrderResType>(`${prefix}/${orderId}`, body)
}

export default orderApiServices