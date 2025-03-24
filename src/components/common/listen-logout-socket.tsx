'use client'
import { handleErrorApi } from '@/lib/utils'
import { useLogoutMutation } from '@/queries/auth.queries'
import { useAuthStore } from '@/stores/auth.stores'
import { useSocketStore } from '@/stores/socket.stores'
import { usePathname, useRouter } from '@/i18n/navigation'
import { useEffect } from 'react'

const UNAUTHENTICATED_PATH = ['/login', '/logout', '/refresh-token']
export default function ListenLogoutSocket() {
    const pathname = usePathname()
    const router = useRouter()
    const { isPending, mutateAsync } = useLogoutMutation()
    const { socket, disconnect: disconnectSocket } = useSocketStore()
    const { setRole } = useAuthStore()

    useEffect(() => {
        if (UNAUTHENTICATED_PATH.includes(pathname)) return
        async function onLogout() {
            if (isPending) return
            try {
                await mutateAsync()
                setRole()
                disconnectSocket()
                router.push('/')
            } catch (error: any) {
                handleErrorApi({
                    error
                })
            }
        }
        if (!socket) return
        socket.on('logout', onLogout)
        return () => {
            socket?.off('logout', onLogout)
        }
    }, [
        socket,
        pathname,
        setRole,
        router,
        isPending,
        mutateAsync,
        disconnectSocket
    ])
    return null
}