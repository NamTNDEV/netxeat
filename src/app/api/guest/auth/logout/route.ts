import guestApiServices from "@/api/services/guestApi.services";
import { cookies } from "next/headers";

export async function POST() {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('accessToken')?.value;
    const refreshToken = cookieStore.get('refreshToken')?.value;
    cookieStore.delete('accessToken');
    cookieStore.delete('refreshToken');
    if (!accessToken || !refreshToken) {
        return Response.json({ message: 'Access token or Refresh token not found' }, { status: 200 });
    }
    try {
        const { payload } = await guestApiServices.logout({
            accessToken,
            refreshToken
        });
        return Response.json(payload);
    } catch (error) {
        console.error(error);
        return Response.json({ message: 'Internal Server Error' }, { status: 200 });
    }
}  