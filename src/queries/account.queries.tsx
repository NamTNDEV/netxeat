import accountApiServices from "@/api/services/accountApi.services"
import accountClientServices from "@/services/accountClient.services"
import { useMutation, useQuery } from "@tanstack/react-query"

export const useGetMeQuery = () => {
    return useQuery({
        queryKey: ['me'],
        queryFn: accountApiServices.getMe,
    })
}

export const useUpdateMeMutation = () => {
    return useMutation({
        mutationFn: accountApiServices.updateMe,
    })
}

export const useChangePasswordMutation = () => {
    return useMutation({
        mutationFn: accountClientServices.changePassword,
    })
}