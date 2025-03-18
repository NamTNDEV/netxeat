import guestClientServices from "@/services/guestClient.services"
import { useMutation } from "@tanstack/react-query"

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