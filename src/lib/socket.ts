import configEnv from '@/configs/env.configs'
import { getAccessTokenFromLocalStorage } from '@/lib/utils'
import { io } from 'socket.io-client'

export const createSocketInstance = (accessToken: string) => {
    return io(configEnv.NEXT_PUBLIC_API_ENDPOINT, {
        auth: {
            Authorization: `Bearer ${accessToken}`,
        }
    })
}
