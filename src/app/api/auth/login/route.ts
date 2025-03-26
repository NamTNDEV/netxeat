import authApiServices from "@/api/services/authApi.services";
import { HttpError } from "@/lib/http";
import { LoginBodyType } from "@/schemaValidations/auth.schema";
import { cookies } from "next/headers";
import jwt from 'jsonwebtoken'

export async function POST(request: Request) {
    const body = (await request.json()) as LoginBodyType;
    const cookieStore = await cookies();
    try {
        const { payload } = await authApiServices.login(body);
        const { accessToken, refreshToken } = payload.data;
        const decodedAccessToken = jwt.decode(accessToken) as any;
        const decodedRefreshToken = jwt.decode(refreshToken) as any;

        cookieStore.set('accessToken', accessToken, {
            path: '/',
            httpOnly: true,
            secure: true,
            sameSite: 'lax',
            expires: decodedAccessToken.exp * 1000
        });

        cookieStore.set('refreshToken', refreshToken, {
            path: '/',
            httpOnly: true,
            secure: true,
            sameSite: 'lax',
            expires: decodedRefreshToken.exp * 1000
        });

        return Response.json(payload);
    } catch (error) {
        if (error instanceof HttpError) {
            return Response.json(error.payload, { status: error.status });
        } else {
            return Response.json({ message: 'Internal Server Error' }, { status: 500 });
        }
    }
}  