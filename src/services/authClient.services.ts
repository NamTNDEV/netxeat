import http from "@/lib/http";
import { LoginBodyType, LoginResType } from "@/schemaValidations/auth.schema";

const prefix = "/api/auth";

const authClientServices = {
    login: (body: LoginBodyType) => http.post<LoginResType>(`${prefix}/login`, body, {
        baseUrl: ''
    }),
    logout: () => http.post(`${prefix}/logout`, null, {
        baseUrl: ''
    }),
};

export default authClientServices;

