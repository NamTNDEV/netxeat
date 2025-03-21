import { decodeToken, getAccessTokenFromLocalStorage, removeAccessTokenFromLocalStorage, removeRefreshTokenFromLocalStorage } from '@/lib/utils'
import { RoleTypeValue } from '@/types/jwt.types'
import { create } from 'zustand'

interface AuthStoreType {
    isAuth: boolean,
    checkAuth: () => void,
    role: RoleTypeValue | undefined,
    setRole: (role?: RoleTypeValue) => void,
}

export const useAuthStore = create<AuthStoreType>((set) => ({
    isAuth: false,
    checkAuth: () => {
        const accessToken = getAccessTokenFromLocalStorage()
        if (accessToken) {
            const { role } = decodeToken(accessToken)
            set({
                role,
                isAuth: !!role,
            })
        }
    },
    role: undefined,
    setRole: (role?: RoleTypeValue) => {
        set({
            role,
            isAuth: !!role,
        })
        if (!role) {
            removeAccessTokenFromLocalStorage()
            removeRefreshTokenFromLocalStorage()
        }
    },
}))