import authApiServices from "@/api/services/authApi.services";
import { cookies } from "next/headers";
import jwt from 'jsonwebtoken'

export async function POST() {
    const cookieStore = cookies();
    const refreshToken = cookieStore.get('refreshToken')?.value;
    if (!refreshToken) {
        return Response.json({ message: 'Unauthorized' }, { status: 401 });
    }
    try {
        const { payload } = await authApiServices.refreshToken({ refreshToken });
        const decodedAccessToken = jwt.decode(payload.data.accessToken) as any;
        const decodedRefreshToken = jwt.decode(payload.data.refreshToken) as any;

        cookieStore.set('accessToken', payload.data.accessToken, {
            path: '/',
            httpOnly: true,
            secure: true,
            sameSite: 'lax',
            expires: decodedAccessToken.exp * 1000
        });

        cookieStore.set('refreshToken', payload.data.refreshToken, {
            path: '/',
            httpOnly: true,
            secure: true,
            sameSite: 'lax',
            expires: decodedRefreshToken.exp * 1000
        });

        return Response.json(payload);
    } catch (error: any) {
        return Response.json({ message: error?.message ?? 'Unauthorized' }, { status: 401 });
    }
}  