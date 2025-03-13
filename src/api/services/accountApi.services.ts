import http from "@/lib/http";
import { AccountResType, UpdateMeBodyType } from "@/schemaValidations/account.schema";
import { LoginBodyType, LoginResType, LogoutBodyType } from "@/schemaValidations/auth.schema";

const accountApiServices = {
    getMe: () => http.get<AccountResType>("/accounts/me"),
    updateMe: (body: UpdateMeBodyType) => http.put<AccountResType>("/accounts/me", body),
};

export default accountApiServices;

