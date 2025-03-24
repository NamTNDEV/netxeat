import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { decodeToken } from './lib/utils'
import { Role } from './constants/type'
import { defaultLocale } from './configs/locale.configs'
import createMiddleware from 'next-intl/middleware'
import { routing } from './i18n/routing'

const manageRoutes = [`${defaultLocale}/manage`]
const guestRoutes = [`${defaultLocale}/guest`]
const onlyOwnerRoutes = [`${defaultLocale}/manage/accounts`]
const privateRoutes = [...manageRoutes, ...guestRoutes]
const publicRoutes = [`${defaultLocale}/login`]

export function middleware(request: NextRequest) {
    const handleI18nRouting = createMiddleware(routing)
    const response = handleI18nRouting(request)
    const { pathname } = request.nextUrl
    const accessToken = request.cookies.get('accessToken')?.value
    const refreshToken = request.cookies.get('refreshToken')?.value
    if (privateRoutes.some(route => pathname.startsWith(route) && !refreshToken)) {
        const url = new URL('/login', request.url)
        url.searchParams.set('isClearTokens', 'true')
        // return NextResponse.redirect(url)
        response.headers.set('x-middleware-rewrite', url.toString())
        return response
    }

    if (refreshToken) {
        if (publicRoutes.some(route => pathname.startsWith(route) && accessToken)) {
            // return NextResponse.redirect(new URL('/', request.url))
            response.headers.set('x-middleware-rewrite', new URL('/', request.url).toString())
            return response
        }

        if (privateRoutes.some(route => pathname.startsWith(route)) && !accessToken) {
            const url = new URL('/refresh-token', request.url)
            url.searchParams.set('refreshToken', refreshToken)
            url.searchParams.set('redirect', pathname)
            // return NextResponse.redirect(url)
            response.headers.set('x-middleware-rewrite', url.toString())
            return response
        }

        const { role } = decodeToken(refreshToken)
        const isGuestGoToManagePath =
            role === Role.Guest &&
            manageRoutes.some((path) => pathname.startsWith(path))
        const isNotGuestGoToGuestPath =
            role !== Role.Guest &&
            guestRoutes.some((path) => pathname.startsWith(path))
        const isOnlyOwnerRoute =
            role !== Role.Owner &&
            onlyOwnerRoutes.some((path) => pathname.startsWith(path))
        if (isOnlyOwnerRoute || isGuestGoToManagePath || isNotGuestGoToGuestPath) {
            // return NextResponse.redirect(new URL('/', request.url))
            response.headers.set('x-middleware-rewrite', new URL('/', request.url).toString())
            return response
        }

        // return NextResponse.next()
        return response
    }


    // return NextResponse.next()
    return response
}

export const config = {
    // matcher: ['/guest/:path*', '/manage/:path*', '/login'],
    matcher: ['/', '/(vi|en)/:path*'],
    unstable_allowDynamic: [
        // allows a single file
        '/lib/utilities.js',
        // use a glob to allow anything in the function-bind 3rd party module
        '**/node_modules/function-bind/**',
    ],
}