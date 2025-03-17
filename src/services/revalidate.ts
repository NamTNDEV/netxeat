import http from '@/lib/http'

const prefix = '/api/revalidate'

const revalidateApiRequest = (tag: string) =>
    http.get(`${prefix}?tag=${tag}`, {
        baseUrl: ''
    })

export default revalidateApiRequest