'use client'
import { checkAndRefreshToken, getAccessTokenFromLocalStorage, getRefreshTokenFromLocalStorage, setAccessTokenToLocalStorage, setRefreshTokenToLocalStorage } from "@/lib/utils"
import { usePathname } from "next/navigation"
import { useEffect } from "react"

const UNAUTHENTICATED_PATHS = ['/login', '/register', '/refresh-token']
const TIMEOUT = (30 * 60 * 1000) / 6

const RefreshToken = () => {
    const pathname = usePathname()

    useEffect(() => {
        if (UNAUTHENTICATED_PATHS.includes(pathname)) return
        let interval: any = null
        checkAndRefreshToken({
            onError: () => {
                clearInterval(interval)
            }
        })
        interval = setInterval(checkAndRefreshToken, 1000)
        return () => clearInterval(interval)
    }, [pathname])

    return null
}

export default RefreshToken