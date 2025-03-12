import { Toaster } from "@/components/ui/sonner"
import { ThemeProvider } from "./theme-provider"
import QueryProvider from "./query-provider"

const AppProvider = ({ children }: { children: React.ReactNode }) => {
    return (
        <QueryProvider>
            <ThemeProvider attribute='class' defaultTheme='system' enableSystem disableTransitionOnChange>
                {children}
                <Toaster />
            </ThemeProvider>
        </QueryProvider>
    )
}

export default AppProvider