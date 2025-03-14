import RefreshToken from "@/components/common/refresh-token"

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    return (
        <>
            <RefreshToken />
            {children}
        </>
    )
}

export default AuthProvider