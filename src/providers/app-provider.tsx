'use client'
import { Toaster } from "@/components/ui/sonner"
import QueryProvider from "./query-provider"
import { ThemeProvider } from "./theme-provider"
import { SocketProvider } from "./socket-provider"
import RefreshToken from "@/components/common/refresh-token"
import ListenLogoutSocket from "@/components/common/listen-logout-socket"
import { useEffect } from "react"
import { useAuthStore } from "@/stores/auth.stores"
import { useSocketStore } from "@/stores/socket.stores"

const AppProvider = ({ children }: { children: React.ReactNode }) => {
    const { checkAuth } = useAuthStore()
    const { connect, disconnect, isConnected, socket } = useSocketStore()

    useEffect(() => {
        checkAuth()
    }, [checkAuth])

    useEffect(() => {
        if (!isConnected) connect();
        if (!socket) return;
        socket.on('connect', () => {
            console.log('%c🔌 Socket connected', 'color: green');
        });

        socket.on('disconnect', () => {
            console.log('%c❌ Socket disconnected', 'color: red');
            disconnect();  // Ngắt kết nối khi socket bị ngắt
        });

        socket.on('connect_error', (error) => {
            console.error('%c⚠️ Socket connection error:', 'color: orange', error);
            disconnect();  // Nếu có lỗi kết nối, ngắt kết nối
        });

        return () => {
            socket.off('connect');
            socket.off('disconnect');
            socket.off('connect_error');
        };
    }, [connect, disconnect, isConnected, socket])

    return (
        <ThemeProvider attribute='class' defaultTheme='system' enableSystem disableTransitionOnChange>
            {/* <AuthProvider> */}
            <QueryProvider>
                {/* <SocketProvider> */}
                <RefreshToken />
                <ListenLogoutSocket />
                {children}
                {/* </SocketProvider> */}
                <Toaster />
            </QueryProvider>
            {/* </AuthProvider> */}
        </ThemeProvider>
    )
}

export default AppProvider