'use client'
import { getAccessTokenFromLocalStorage, getRefreshTokenFromLocalStorage } from '@/lib/utils'
import { useAuthContext } from '@/providers/auth-provider'
import { useLogoutMutation } from '@/queries/auth.queries'
import { useRouter, useSearchParams } from 'next/navigation'
import { Suspense, useEffect, useRef } from 'react'

const LogoutPage = () => {
    const { mutateAsync } = useLogoutMutation()
    const router = useRouter()
    const accessTokenFromUrl = useSearchParams().get('accessToken')
    const refreshTokenFromUrl = useSearchParams().get('refreshToken')
    const ref = useRef<any>(null)
    const { handleAuth } = useAuthContext()

    useEffect(() => {
        if (ref.current || !accessTokenFromUrl || !refreshTokenFromUrl ||
            refreshTokenFromUrl !== getRefreshTokenFromLocalStorage() ||
            accessTokenFromUrl !== getAccessTokenFromLocalStorage()) router.push('/')
        ref.current = mutateAsync
        mutateAsync().then(res => {
            setTimeout(() => {
                ref.current = null
            }, 2000)
            handleAuth(false)
            router.push('/login')
        })
    }, [mutateAsync, router, refreshTokenFromUrl, accessTokenFromUrl, handleAuth])

    return (
        <div>LogoutPage</div>
    )
}

const LogoutSuspenseWrapper = () => {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <LogoutPage />
        </Suspense>
    )
}

export default LogoutSuspenseWrapper