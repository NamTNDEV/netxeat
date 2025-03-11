import http from "@/lib/http";
import { LoginBodyType, LoginResType } from "@/schemaValidations/auth.schema";

const authApiServices = {
    login: (body: LoginBodyType) => http.post<LoginResType>("/auth/login", body),
};

export default authApiServices;

