import { cookies } from "next/headers";
import { decodeToken } from "@/lib/utils";
import guestApiServices from "@/api/services/guestApi.services";

export async function POST() {
    const cookieStore = cookies();
    const refreshToken = cookieStore.get('refreshToken')?.value;
    if (!refreshToken) {
        return Response.json({ message: 'Unauthorized' }, { status: 401 });
    }
    try {
        const { payload } = await guestApiServices.refreshToken({ refreshToken });
        const decodedAccessToken = decodeToken(payload.data.accessToken);
        const decodedRefreshToken = decodeToken(payload.data.refreshToken);
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