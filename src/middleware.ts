import { NextResponse, type NextRequest } from 'next/server'
import { decodeToken } from './lib/utils'
import { Role } from './constants/type'
import { defaultLocale } from './configs/locale.configs'
import createMiddleware from 'next-intl/middleware'
import { routing } from './i18n/routing'

const manageRoutes = ['/vi/manage', '/en/manage']
const guestRoutes = ['/vi/guest', '/en/guest']
const onlyOwnerRoutes = ['/vi/manage/accounts', '/en/manage/accounts']
const privateRoutes = [...manageRoutes, ...guestRoutes]
const publicRoutes = ['/vi/login', '/en/login']

export function middleware(request: NextRequest) {
    const handleI18nRouting = createMiddleware(routing)
    const response = handleI18nRouting(request)
    const { pathname } = request.nextUrl
    const accessToken = request.cookies.get('accessToken')?.value
    const refreshToken = request.cookies.get('refreshToken')?.value
    const locale = request.cookies.get('NEXT_LOCALE')?.value ?? defaultLocale
    if (privateRoutes.some(route => pathname.startsWith(route) && !refreshToken)) {
        const url = new URL(`/${locale}/login`, request.url)
        url.searchParams.set('isClearTokens', 'true')
        return NextResponse.redirect(url)
        // response.headers.set('x-middleware-rewrite', url.toString())
        // return response
    }

    if (refreshToken) {
        if (publicRoutes.some(route => pathname.startsWith(route) && accessToken)) {
            return NextResponse.redirect(new URL(`/${locale}`, request.url))
            // response.headers.set('x-middleware-rewrite', new URL('/', request.url).toString())
            // return response
        }

        if (privateRoutes.some(route => pathname.startsWith(route)) && !accessToken) {
            const url = new URL(`/${locale}/refresh-token`, request.url)
            url.searchParams.set('refreshToken', refreshToken)
            url.searchParams.set('redirect', pathname)
            return NextResponse.redirect(url)
            // response.headers.set('x-middleware-rewrite', url.toString())
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
            return NextResponse.redirect(new URL(`/${locale}`, request.url))
            // response.headers.set('x-middleware-rewrite', new URL('/', request.url).toString())
            // return response
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