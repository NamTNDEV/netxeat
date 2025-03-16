import { dishApiServices } from "@/api/services/dishApi.services"
import { useQuery } from "@tanstack/react-query"

export const useGetDishesQuery = () => {
    return useQuery({
        queryKey: ['dishes'],
        queryFn: dishApiServices.getDishes,
    })
}