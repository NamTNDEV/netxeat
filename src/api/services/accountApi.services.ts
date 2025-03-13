import http from "@/lib/http";
import { AccountResType, ChangePasswordV2BodyType, ChangePasswordV2ResType, UpdateMeBodyType } from "@/schemaValidations/account.schema";

const prefix = "/accounts";

const accountApiServices = {
    getMe: () => http.get<AccountResType>(`${prefix}/me`),
    updateMe: (body: UpdateMeBodyType) => http.put<AccountResType>(`${prefix}/me`, body),
    changePassword: (body: ChangePasswordV2BodyType, accessToken: string) => http.put<ChangePasswordV2ResType>(`${prefix}/change-password-v2`, body, {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        }
    }),
};

export default accountApiServices;

