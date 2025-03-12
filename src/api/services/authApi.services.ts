import http from "@/lib/http";
import { LoginBodyType, LoginResType, LogoutBodyType } from "@/schemaValidations/auth.schema";

const authApiServices = {
    login: (body: LoginBodyType) => http.post<LoginResType>("/auth/login", body),
    logout: (body: LogoutBodyType & { accessToken: string }) => http.post("/auth/logout", body, {
        headers: {
            Authorization: `Bearer ${body.accessToken}`,
        },
    }),
};

export default authApiServices;

