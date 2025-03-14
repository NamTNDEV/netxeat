'use client'
import { getAccessTokenFromLocalStorage, getRefreshTokenFromLocalStorage, setAccessTokenToLocalStorage, setRefreshTokenToLocalStorage } from "@/lib/utils"
import { usePathname } from "next/navigation"
import { useEffect } from "react"
import jwt from "jsonwebtoken"
import authClientServices from "@/services/authClient.services"

const UNAUTHENTICATED_PATHS = ['/login', '/register', '/refresh-token']
const TIMEOUT = (30 * 60 * 1000) / 6

const RefreshToken = () => {
    const pathname = usePathname()

    useEffect(() => {
        if (UNAUTHENTICATED_PATHS.includes(pathname)) return
        let interval: any = null
        const checkAndRefreshToken = async () => {
            console.log("Check :::")
            const accessToken = getAccessTokenFromLocalStorage()
            const refreshToken = getRefreshTokenFromLocalStorage()
            if (!accessToken || !refreshToken) return
            const decodedAccessToken = jwt.decode(accessToken) as {
                exp: number,
                iat: number
            }
            const decodedRefreshToken = jwt.decode(refreshToken) as {
                exp: number,
                iat: number
            }
            const currentTime = Date.now() / 1000
            if (decodedRefreshToken.exp <= currentTime) return
            if (decodedAccessToken.exp - currentTime < (decodedAccessToken.exp - decodedAccessToken.iat) / 3) {
                try {
                    const res = await authClientServices.refreshToken()
                    setAccessTokenToLocalStorage(res.payload.data.accessToken)
                    setRefreshTokenToLocalStorage(res.payload.data.refreshToken)
                } catch (error) {
                    clearInterval(interval)
                }
            }
        }
        checkAndRefreshToken()
        interval = setInterval(checkAndRefreshToken, 1000)
        return () => clearInterval(interval)
    }, [pathname])

    return null
}

export default RefreshToken