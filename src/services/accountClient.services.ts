import http from "@/lib/http";
import { ChangePasswordV2BodyType, ChangePasswordV2ResType } from "@/schemaValidations/account.schema";

const prefix = "/api/accounts";

const accountClientServices = {
    changePassword: (body: ChangePasswordV2BodyType) => http.put<ChangePasswordV2ResType>(`${prefix}/change-password-v2`, body, { baseUrl: '' }),
};

export default accountClientServices;

