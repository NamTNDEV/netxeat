import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const privateRoutes = ['/manage']
const publicRoutes = ['/login']

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl
    const isAuth = !!request.cookies.get('accessToken')?.value
    if (privateRoutes.some(route => pathname.startsWith(route) && !isAuth)) {
        return NextResponse.redirect(new URL('/login', request.url))
    }
    if (publicRoutes.some(route => pathname.startsWith(route) && isAuth)) {
        return NextResponse.redirect(new URL('/', request.url))
    }
    return NextResponse.next()
}

export const config = {
    matcher: ['/manage/:path*', '/login']
}