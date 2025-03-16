'use client'
import RefreshToken from "@/components/common/refresh-token"
import { getAccessTokenFromLocalStorage, removeAccessTokenFromLocalStorage, removeRefreshTokenFromLocalStorage } from "@/lib/utils"
import { createContext, useCallback, useContext, useEffect, useState } from "react"

const AuthContext = createContext({
    isAuth: false,
    handleAuth: (isAuth: boolean) => { }
})

export const useAuthContext = () => {
    return useContext(AuthContext)
}

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [isAuth, setIsAuth] = useState(false)

    useEffect(() => {
        const accessToken = getAccessTokenFromLocalStorage()
        if (accessToken) {
            setIsAuth(true)
        }
    }, [])

    const handleAuth = useCallback((isAuth: boolean) => {
        if (isAuth) {
            setIsAuth(true)
        } else {
            setIsAuth(false)
            removeAccessTokenFromLocalStorage()
            removeRefreshTokenFromLocalStorage()
        }
    }, [])

    return (
        <AuthContext.Provider value={{
            isAuth,
            handleAuth
        }}>
            <RefreshToken />
            {children}
        </AuthContext.Provider>
    )
}

export default AuthProvider