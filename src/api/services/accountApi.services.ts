import http from "@/lib/http";
import { AccountListResType, AccountResType, ChangePasswordV2BodyType, ChangePasswordV2ResType, CreateEmployeeAccountBodyType, UpdateEmployeeAccountBodyType, UpdateMeBodyType } from "@/schemaValidations/account.schema";

const prefix = "/accounts";

const accountApiServices = {
    getMe: () => http.get<AccountResType>(`${prefix}/me`),
    updateMe: (body: UpdateMeBodyType) => http.put<AccountResType>(`${prefix}/me`, body),
    changePassword: (body: ChangePasswordV2BodyType, accessToken: string) => http.put<ChangePasswordV2ResType>(`${prefix}/change-password-v2`, body, {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        }
    }),
    getListAccount: () => http.get<AccountListResType[]>(`${prefix}`),
    getAccount: (id: number) => http.get<AccountResType>(`${prefix}/detail/${id}`),
    createAccount: (body: CreateEmployeeAccountBodyType) => http.post<AccountResType>(`${prefix}`, body),
    updateAccount: (id: number, body: UpdateEmployeeAccountBodyType) => http.put<AccountResType>(`${prefix}/detail/${id}`, body),
    deleteAccount: (id: number) => http.delete<AccountResType>(`${prefix}/detail/${id}`),
};

export default accountApiServices;

