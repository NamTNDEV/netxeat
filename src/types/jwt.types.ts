import { Role, TokenType } from "@/constants/type";

export type TokenTypeValue = (typeof TokenType)[keyof typeof TokenType]
export type RoleTypeValue = (typeof Role)[keyof typeof Role]

export interface TokenPayloadType {
    userId: number
    role: RoleTypeValue
    type: TokenTypeValue
    iat: number
    exp: number
}