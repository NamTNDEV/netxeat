import http from '@/lib/http'
import { UploadImageResType } from '@/schemaValidations/media.schema'

const prefix = '/media'

export const mediaApiServices = {
    upload: (formData: FormData) =>
        http.post<UploadImageResType>(`${prefix}/upload`, formData)
}