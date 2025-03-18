'use client'
import RefreshToken from "@/components/common/refresh-token"
import { decodeToken, getAccessTokenFromLocalStorage, removeAccessTokenFromLocalStorage, removeRefreshTokenFromLocalStorage } from "@/lib/utils"
import { RoleTypeValue } from "@/types/jwt.types"
import { createContext, useCallback, useContext, useEffect, useState } from "react"

const AuthContext = createContext({
    isAuth: false,
    roleState: undefined as RoleTypeValue | undefined,
    setRole: (role?: RoleTypeValue) => { },
})

export const useAuthContext = () => {
    return useContext(AuthContext)
}

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [roleState, setRoleState] = useState<RoleTypeValue | undefined>(undefined)

    useEffect(() => {
        const accessToken = getAccessTokenFromLocalStorage()
        if (accessToken) {
            const { role } = decodeToken(accessToken)
            setRole(role)
        }
    }, [])

    const setRole = useCallback((role?: RoleTypeValue) => {
        if (!role) {
            removeAccessTokenFromLocalStorage()
            removeRefreshTokenFromLocalStorage()
        }
        setRoleState(role)
    }, [])

    const isAuth = Boolean(roleState)

    return (
        <AuthContext.Provider value={{
            isAuth,
            roleState,
            setRole
        }}>
            <RefreshToken />
            {children}
        </AuthContext.Provider>
    )
}

export default AuthProvider