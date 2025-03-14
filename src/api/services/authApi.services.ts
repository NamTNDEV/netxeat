import http from "@/lib/http";
import { LoginBodyType, LoginResType, LogoutBodyType, RefreshTokenBodyType, RefreshTokenResType } from "@/schemaValidations/auth.schema";

const prefix = "/auth";

const authApiServices = {
    login: (body: LoginBodyType) => http.post<LoginResType>(`${prefix}/login`, body),
    logout: (body: LogoutBodyType & { accessToken: string }) => http.post(`${prefix}/logout`, body, {
        headers: {
            Authorization: `Bearer ${body.accessToken}`,
        },
    }),
    refreshToken: (body: RefreshTokenBodyType) => http.post<RefreshTokenResType>(`${prefix}/refresh-token`, body),
};

export default authApiServices;

