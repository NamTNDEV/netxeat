'use client'
import SearchParamsLoader, { useSearchParamsLoader } from '@/components/common/search-params-loader'
import { checkAndRefreshToken, getRefreshTokenFromLocalStorage } from '@/lib/utils'
import { useRouter } from 'next/navigation'
import React, { useEffect } from 'react'

const RefreshToken = () => {
    const router = useRouter()
    const { searchParams, setSearchParams } = useSearchParamsLoader()
    const refreshToken = searchParams?.get('refreshToken')
    const redirectPathname = searchParams?.get('redirect')
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
        <>
            <SearchParamsLoader onParamsReceived={setSearchParams} />
            <div>RefreshTokenPage</div>
        </>
    )
}

export default RefreshToken