'use client'
import { checkAndRefreshToken, getAccessTokenFromLocalStorage, getRefreshTokenFromLocalStorage, setAccessTokenToLocalStorage, setRefreshTokenToLocalStorage } from "@/lib/utils"
import { useSocketStore } from "@/stores/socket.stores"
import { usePathname, useRouter } from "next/navigation"
import { useEffect } from "react"

const UNAUTHENTICATED_PATHS = ['/login', '/register', '/refresh-token']
const TIMEOUT = (30 * 60 * 1000) / 6

const RefreshToken = () => {
    const router = useRouter()
    const pathname = usePathname()
    const { disconnect: disconnectSocket, socket } = useSocketStore()

    useEffect(() => {
        if (UNAUTHENTICATED_PATHS.includes(pathname)) return
        let interval: any = null
        const handleRefreshToken = (isForceRefresh?: boolean) => checkAndRefreshToken({
            onError: () => {
                clearInterval(interval)
                disconnectSocket()
                router.push('/login')
            },
            isForceRefresh
        })
        handleRefreshToken()
        interval = setInterval(handleRefreshToken, TIMEOUT)

        if (!socket) return

        function onRefreshTokenSocket() {
            handleRefreshToken(true)
        }

        socket.on('refresh-token', onRefreshTokenSocket)

        return () => {
            clearInterval(interval)
            socket.off('refresh-token', onRefreshTokenSocket)
        }
    }, [router, pathname, socket, disconnectSocket])

    return null
}

export default RefreshToken