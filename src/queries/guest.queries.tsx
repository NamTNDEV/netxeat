import guestApiServices from "@/api/services/guestApi.services"
import guestClientServices from "@/services/guestClient.services"
import { QueryClient, useMutation, useQuery } from "@tanstack/react-query"

export const useGuestGetOrderListQuery = () => {
    return useQuery({
        queryKey: ['guest-order-list'],
        queryFn: guestApiServices.getOrderList,
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