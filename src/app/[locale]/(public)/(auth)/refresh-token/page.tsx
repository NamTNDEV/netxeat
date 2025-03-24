'use client'
import { checkAndRefreshToken, getRefreshTokenFromLocalStorage } from '@/lib/utils'
import { useRouter, useSearchParams } from 'next/navigation'
import React, { Suspense, useEffect } from 'react'

const RefreshTokenPage = () => {
    const router = useRouter()
    const searchParams = useSearchParams()
    const refreshToken = searchParams.get('refreshToken')
    const redirectPathname = searchParams.get('redirect')
    useEffect(() => {
        if (
            refreshToken &&
            refreshToken === getRefreshTokenFromLocalStorage()
        ) {
            checkAndRefreshToken({
                onSuccess: () => {
                    console.log("RefreshTokenPage: onSuccess")
                    router.push(redirectPathname || '/')
                }
            })
        } else {
            router.push('/')
        }
    }, [router, refreshToken, redirectPathname])

    return (
        <div>RefreshTokenPage</div>
    )
}

const RefreshTokenSuspenseWrapper = () => {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <RefreshTokenPage />
        </Suspense>
    )
}

export default RefreshTokenSuspenseWrapper