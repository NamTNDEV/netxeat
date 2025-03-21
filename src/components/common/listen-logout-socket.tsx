'use client'
import { handleErrorApi } from '@/lib/utils'
import { useAuthContext } from '@/providers/auth-provider'
import { useSocketContext } from '@/providers/socket-provider'
import { useLogoutMutation } from '@/queries/auth.queries'
import { usePathname } from 'next/navigation'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

const UNAUTHENTICATED_PATH = ['/login', '/logout', '/refresh-token']
export default function ListenLogoutSocket() {
    const pathname = usePathname()
    const router = useRouter()
    const { isPending, mutateAsync } = useLogoutMutation()
    const { socket, disconnect: disconnectSocket } = useSocketContext()
    const { setRole } = useAuthContext()

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