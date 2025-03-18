import http from "@/lib/http";
import { LogoutBodyType, RefreshTokenBodyType, RefreshTokenResType } from "@/schemaValidations/auth.schema";
import { GuestCreateOrdersBodyType, GuestCreateOrdersResType, GuestGetOrdersResType, GuestLoginBodyType, GuestLoginResType } from "@/schemaValidations/guest.schema";

const prefix = "/guest";

const guestApiServices = {
    login: (body: GuestLoginBodyType) => http.post<GuestLoginResType>(`${prefix}/auth/login`, body),
    logout: (body: LogoutBodyType & { accessToken: string }) => {
        return http.post(`${prefix}/auth/logout`, {
            refreshToken: body.refreshToken,
        }, {
            headers: {
                Authorization: `Bearer ${body.accessToken}`,
            },
        });
    },
    refreshToken: (body: RefreshTokenBodyType) => http.post<RefreshTokenResType>(`${prefix}/auth/refresh-token`, body),
    getOrderList: () => http.get<GuestGetOrdersResType>(`${prefix}/orders`),
    proceedOrder: (body: GuestCreateOrdersBodyType) =>
        http.post<GuestCreateOrdersResType>(`${prefix}/orders`, body)
};

export default guestApiServices;

