import { mediaApiServices } from '@/api/services/mediaApi.services'
import { useMutation } from '@tanstack/react-query'

export const useUploadMediaMutation = () => {
    return useMutation({
        mutationFn: mediaApiServices.upload
    })
}