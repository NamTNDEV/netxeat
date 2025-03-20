import http from "@/lib/http";
import { AccountListResType, AccountResType, ChangePasswordV2BodyType, ChangePasswordV2ResType, CreateEmployeeAccountBodyType, CreateGuestBodyType, CreateGuestResType, GetGuestListQueryParamsType, UpdateEmployeeAccountBodyType, UpdateMeBodyType } from "@/schemaValidations/account.schema";
import queryString from 'query-string'

const prefix = "/accounts";

const accountApiServices = {
    getMe: () => http.get<AccountResType>(`${prefix}/me`),
    updateMe: (body: UpdateMeBodyType) => http.put<AccountResType>(`${prefix}/me`, body),
    changePassword: (body: ChangePasswordV2BodyType, accessToken: string) => http.put<ChangePasswordV2ResType>(`${prefix}/change-password-v2`, body, {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        }
    }),
    getListAccount: () => http.get<AccountListResType>(`${prefix}`),
    getAccount: (id: number) => http.get<AccountResType>(`${prefix}/detail/${id}`),
    createAccount: (body: CreateEmployeeAccountBodyType) => http.post<AccountResType>(`${prefix}`, body),
    updateAccount: (id: number, body: UpdateEmployeeAccountBodyType) => http.put<AccountResType>(`${prefix}/detail/${id}`, body),
    deleteAccount: (id: number) => http.delete<AccountResType>(`${prefix}/detail/${id}`),
    createNewGuest: (body: CreateGuestBodyType) => http.post<CreateGuestResType>(`${prefix}/guest`, body),
    getListGuest: (queryParams: GetGuestListQueryParamsType) => http.get<AccountListResType>(`${prefix}/guest?${queryString.stringify({
        fromDate: queryParams.fromDate?.toISOString(),
        toDate: queryParams.toDate?.toISOString(),
    })}`),
};

export default accountApiServices;

