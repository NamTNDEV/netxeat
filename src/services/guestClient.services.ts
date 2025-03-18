import http from "@/lib/http";
import { RefreshTokenResType } from "@/schemaValidations/auth.schema";
import { GuestLoginBodyType, GuestLoginResType } from "@/schemaValidations/guest.schema";

const prefix = "/api/guest";

const guestClientServices = {
    refreshTokenRequest: null as Promise<{
        status: number;
        payload: RefreshTokenResType
    }> | null,
    login: (body: GuestLoginBodyType) => http.post<GuestLoginResType>(`${prefix}/auth/login`, body, {
        baseUrl: ''
    }),
    logout: () => http.post(`${prefix}/auth//logout`, null, {
        baseUrl: ''
    }),
    async refreshToken() {
        if (this.refreshTokenRequest) {
            return this.refreshTokenRequest;
        }
        this.refreshTokenRequest = http.post<RefreshTokenResType>(`${prefix}/auth//refresh-token`, null, { baseUrl: '' });
        const result = await this.refreshTokenRequest;
        this.refreshTokenRequest = null;
        return result;
    },
};

export default guestClientServices;

