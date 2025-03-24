import { HttpError } from "@/lib/http";
import { cookies } from "next/headers";
import jwt from 'jsonwebtoken'
import { ChangePasswordV2BodyType } from "@/schemaValidations/account.schema";
import accountApiServices from "@/api/services/accountApi.services";

export async function PUT(request: Request) {
    const body = (await request.json()) as ChangePasswordV2BodyType;
    const cookieStore = cookies();
    const access_token = cookieStore.get('accessToken')?.value;
    if (!access_token) {
        return Response.json({ message: 'Unauthorized' }, { status: 401 });
    }
    try {
        const { payload } = await accountApiServices.changePassword(body, access_token);
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