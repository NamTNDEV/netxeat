'use client'
import { Toaster } from "@/components/ui/sonner"
import QueryProvider from "./query-provider"
import AuthProvider from "./auth-provider"
import { ThemeProvider } from "./theme-provider"
import { SocketProvider } from "./socket-provider"
import RefreshToken from "@/components/common/refresh-token"

const AppProvider = ({ children }: { children: React.ReactNode }) => {
    return (
        <ThemeProvider attribute='class' defaultTheme='system' enableSystem disableTransitionOnChange>
            <AuthProvider>
                <QueryProvider>
                    <SocketProvider>
                        <RefreshToken />
                        {children}
                    </SocketProvider>
                    <Toaster />
                </QueryProvider>
            </AuthProvider>
        </ThemeProvider>
    )
}

export default AppProvider