import authClientServices from "@/services/authClient.services"
import { useMutation } from "@tanstack/react-query"

export const useLoginMutation = () => {
    return useMutation({
        mutationFn: authClientServices.login,
    })
}

export const useLogoutMutation = () => {
    return useMutation({
        mutationFn: authClientServices.logout,
    })
}