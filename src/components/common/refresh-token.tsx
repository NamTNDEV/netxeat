'use client'
import socket from "@/lib/socket"
import { checkAndRefreshToken, getAccessTokenFromLocalStorage, getRefreshTokenFromLocalStorage, setAccessTokenToLocalStorage, setRefreshTokenToLocalStorage } from "@/lib/utils"
import { usePathname, useRouter } from "next/navigation"
import { useEffect } from "react"

const UNAUTHENTICATED_PATHS = ['/login', '/register', '/refresh-token']
const TIMEOUT = (30 * 60 * 1000) / 6

const RefreshToken = () => {
    const router = useRouter()
    const pathname = usePathname()

    useEffect(() => {
        if (UNAUTHENTICATED_PATHS.includes(pathname)) return
        let interval: any = null
        const handleRefreshToken = (isForceRefresh?: boolean) => checkAndRefreshToken({
            onError: () => {
                clearInterval(interval)
                router.push('/login')
            },
            isForceRefresh
        })
        handleRefreshToken()
        interval = setInterval(handleRefreshToken, TIMEOUT)

        if (socket.connected) {
            onConnect()
        }

        function onConnect() {
            console.log(socket.id)
        }

        function onDisconnect() {
            console.log('disconnect')
        }

        function onRefreshTokenSocket() {
            handleRefreshToken(true)
        }

        socket.on('connect', onConnect)
        socket.on('disconnect', onDisconnect)
        socket.on('refresh-token', onRefreshTokenSocket)

        return () => {
            clearInterval(interval)
            socket.off('connect', onConnect)
            socket.off('disconnect', onDisconnect)
            socket.off('refresh-token', onRefreshTokenSocket)
        }
    }, [router, pathname])

    return null
}

export default RefreshToken