'use client'
import { checkAndRefreshToken, getRefreshTokenFromLocalStorage } from '@/lib/utils'
import { useRouter, useSearchParams } from 'next/navigation'
import React, { use, useEffect } from 'react'

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
                    router.push(redirectPathname || '/')
                }
            })
        }
    }, [router, refreshToken, redirectPathname])

    return (
        <div>RefreshTokenPage</div>
    )
}

export default RefreshTokenPage