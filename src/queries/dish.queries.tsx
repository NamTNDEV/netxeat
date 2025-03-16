import { dishApiServices } from "@/api/services/dishApi.services"
import { UpdateDishBodyType } from "@/schemaValidations/dish.schema"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

export const useGetDishesQuery = () => {
    return useQuery({
        queryKey: ['list-dish'],
        queryFn: dishApiServices.getDishes,
    })
}

export const useGetDishQuery = (id: number | undefined) => {
    return useQuery({
        queryKey: ['dish', id],
        queryFn: () => dishApiServices.getDish(id as number),
        enabled: Boolean(id)
    })
}

export const useCreateDishMutation = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: dishApiServices.createDish,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['list-dish']
            })
        }
    })
}

export const useUpdateDishMutation = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: ({ id, ...body }: { id: number } & UpdateDishBodyType) => dishApiServices.updateDish(id, body),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['list-dish']
            })
        }
    })
}

export const useDeleteDishMutation = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: dishApiServices.deleteDish,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['list-dish']
            })
        }
    })
}