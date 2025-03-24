'use client'
import { getAccessTokenFromLocalStorage, getRefreshTokenFromLocalStorage } from '@/lib/utils'
import { useLogoutMutation } from '@/queries/auth.queries'
import { useAuthStore } from '@/stores/auth.stores'
import { useSocketStore } from '@/stores/socket.stores'
import { useSearchParams } from 'next/navigation'
import { useRouter } from '@/i18n/navigation'
import { useEffect, useRef } from 'react'

const LogoutPage = () => {
    const { mutateAsync } = useLogoutMutation()
    const router = useRouter()
    const accessTokenFromUrl = useSearchParams().get('accessToken')
    const refreshTokenFromUrl = useSearchParams().get('refreshToken')
    const ref = useRef<any>(null)
    const { setRole } = useAuthStore()
    const { disconnect: disconnectSocket } = useSocketStore()

    useEffect(() => {
        if (ref.current || !accessTokenFromUrl || !refreshTokenFromUrl ||
            refreshTokenFromUrl !== getRefreshTokenFromLocalStorage() ||
            accessTokenFromUrl !== getAccessTokenFromLocalStorage()) router.push('/')
        ref.current = mutateAsync
        mutateAsync().then(res => {
            setTimeout(() => {
                ref.current = null
            }, 2000)
            setRole()
            disconnectSocket()
            router.push('/login')
        })
    }, [mutateAsync, router, refreshTokenFromUrl, accessTokenFromUrl, setRole, disconnectSocket])

    return (
        <div>LogoutPage</div>
    )
}

const LogoutSuspenseWrapper = () => {
    return (
        <LogoutPage />
    )
}

export default LogoutSuspenseWrapper