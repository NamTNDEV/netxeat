import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const privateRoutes = ['/manage']
const publicRoutes = ['/login']

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl
    const accessToken = request.cookies.get('accessToken')?.value
    const refreshToken = request.cookies.get('refreshToken')?.value
    if (privateRoutes.some(route => pathname.startsWith(route) && !refreshToken)) {
        return NextResponse.redirect(new URL('/login', request.url))
    }
    if (publicRoutes.some(route => pathname.startsWith(route) && refreshToken)) {
        return NextResponse.redirect(new URL('/', request.url))
    }
    if (privateRoutes.some(route => pathname.startsWith(route)) && refreshToken && !accessToken) {
        const url = new URL('/refresh-token', request.url)
        url.searchParams.set('refreshToken', refreshToken)
        url.searchParams.set('redirect', pathname)
        return NextResponse.redirect(url)
    }
    return NextResponse.next()
}

export const config = {
    matcher: ['/manage/:path*', '/login']
}