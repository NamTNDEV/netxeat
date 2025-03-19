import configEnv from '@/configs/env.configs'
import { getAccessTokenFromLocalStorage } from '@/lib/utils'
import { io } from 'socket.io-client'

const socket = io(configEnv.NEXT_PUBLIC_API_ENDPOINT, {
    auth: {
        Authorization: `Bearer ${getAccessTokenFromLocalStorage()}`
    }
})

export default socket