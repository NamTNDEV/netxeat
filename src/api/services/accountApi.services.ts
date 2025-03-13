import http from "@/lib/http";
import { AccountResType } from "@/schemaValidations/account.schema";
import { LoginBodyType, LoginResType, LogoutBodyType } from "@/schemaValidations/auth.schema";

const accountApiServices = {
    getMe: () => http.get<AccountResType>("/accounts/me"),
};

export default accountApiServices;

