import accountApiServices from "@/api/services/accountApi.services"
import { UpdateEmployeeAccountBodyType } from "@/schemaValidations/account.schema"
import accountClientServices from "@/services/accountClient.services"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

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

export const useGetListAccountQuery = () => {
    return useQuery({
        queryKey: ['list-account'],
        queryFn: accountApiServices.getListAccount,
    })
}

export const useGetAccountQuery = (id: number) => {
    return useQuery({
        queryKey: ['account', id],
        queryFn: () => accountApiServices.getAccount(id),
    }
    )
}

export const useCreateAccountMutation = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: accountApiServices.createAccount,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['list-account']
            })
        }
    })
}

export const useUpdateAccountMutation = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: ({ id, ...body }: { id: number } & UpdateEmployeeAccountBodyType) => accountApiServices.updateAccount(id, body),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['list-account']
            })
        }
    })
}

export const useDeleteAccountMutation = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: accountApiServices.deleteAccount,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['list-account']
            })
        }
    })
}