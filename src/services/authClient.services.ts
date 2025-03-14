import http from "@/lib/http";
import { LoginBodyType, LoginResType, RefreshTokenResType } from "@/schemaValidations/auth.schema";

const prefix = "/api/auth";

const authClientServices = {
    refreshTokenRequest: null as Promise<{
        status: number;
        payload: RefreshTokenResType
    }> | null,
    login: (body: LoginBodyType) => http.post<LoginResType>(`${prefix}/login`, body, {
        baseUrl: ''
    }),
    logout: () => http.post(`${prefix}/logout`, null, {
        baseUrl: ''
    }),
    async refreshToken() {
        if (this.refreshTokenRequest) {
            return this.refreshTokenRequest;
        }
        this.refreshTokenRequest = http.post<RefreshTokenResType>(`${prefix}/refresh-token`, null, { baseUrl: '' });
        const result = await this.refreshTokenRequest;
        this.refreshTokenRequest = null;
        return result;
    },
};

export default authClientServices;

