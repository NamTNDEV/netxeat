'use client'
import { Toaster } from "@/components/ui/sonner"
import QueryProvider from "./query-provider"
import AuthProvider from "./auth-provider"

const AppProvider = ({ children }: { children: React.ReactNode }) => {
    return (
        <AuthProvider>
            <QueryProvider>
                {children}
                <Toaster />
            </QueryProvider>
        </AuthProvider>
    )
}

export default AppProvider