import { tableApiServices } from "@/api/services/tableApi.services"
import { UpdateTableBodyType } from "@/schemaValidations/table.schema"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

export const useGetListTableQuery = () => {
    return useQuery({
        queryKey: ['list-table'],
        queryFn: tableApiServices.getTables,
    })
}

export const useGetTableQuery = (id: number | undefined) => {
    return useQuery({
        queryKey: ['table', id],
        queryFn: () => tableApiServices.getTable(id as number),
        enabled: Boolean(id)
    })
}

export const useCreateTableMutation = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: tableApiServices.createTable,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['list-table']
            })
        },
    })
}

export const useUpdateTableMutation = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: ({ id, ...body }: { id: number } & UpdateTableBodyType) => tableApiServices.updateTable(id, body),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['list-table']
            })
        },
    })
}

export const useDeleteTableMutation = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: tableApiServices.deleteTable,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['list-table']
            })
        },
    })
}