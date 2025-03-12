import http from "@/lib/http";
import { LoginBodyType, LoginResType } from "@/schemaValidations/auth.schema";

const authClientServices = {
    login: (body: LoginBodyType) => http.post<LoginResType>("/api/auth/login", body, {
        baseUrl: ''
    }),
    logout: () => http.post("/api/auth/logout", null, {
        baseUrl: ''
    }),
};

export default authClientServices;

