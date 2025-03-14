import { Toaster } from "@/components/ui/sonner"
import { ThemeProvider } from "./theme-provider"
import QueryProvider from "./query-provider"
import AuthProvider from "./auth-provider"

const AppProvider = ({ children }: { children: React.ReactNode }) => {
    return (
        <AuthProvider>
            <QueryProvider>
                <ThemeProvider attribute='class' defaultTheme='system' enableSystem disableTransitionOnChange>
                    {children}
                    <Toaster />
                </ThemeProvider>
            </QueryProvider>
        </AuthProvider>
    )
}

export default AppProvider