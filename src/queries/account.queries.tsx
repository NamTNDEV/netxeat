import accountApiServices from "@/api/services/accountApi.services"
import { useQuery } from "@tanstack/react-query"

export const useGetMeQuery = () => {
    return useQuery({
        queryKey: ['me'],
        queryFn: accountApiServices.getMe,
    })
}