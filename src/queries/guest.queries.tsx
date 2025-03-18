import guestApiServices from "@/api/services/guestApi.services"
import guestClientServices from "@/services/guestClient.services"
import { useMutation, useQuery } from "@tanstack/react-query"

export const useGuestGetOrderListQuery = () => {
    return useQuery({
        queryFn: guestApiServices.getOrderList,
        queryKey: ['guest-order-list']
    })
}

export const useGuestLoginMutation = () => {
    return useMutation({
        mutationFn: guestClientServices.login,
    })
}

export const useGuestLogoutMutation = () => {
    return useMutation({
        mutationFn: guestClientServices.logout,
    })
}

export const useGuestOrderMutation = () => {
    return useMutation({
        mutationFn: guestApiServices.proceedOrder
    })
}