'use client';

import { createSocketInstance } from "@/lib/socket";
import { getAccessTokenFromLocalStorage } from "@/lib/utils";
import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { Socket } from "socket.io-client";

const SocketContext = createContext({
    socket: undefined as Socket | undefined,
    setSocket: (socket: Socket | undefined) => { },
    disconnect: () => { },
});

export const useSocketContext = () => useContext(SocketContext);

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
    const isConnectedRef = useRef(false);
    const [socket, setSocket] = useState<Socket | undefined>(undefined);

    useEffect(() => {
        if (isConnectedRef.current) return;
        const accessToken = getAccessTokenFromLocalStorage();
        if (!accessToken) return;
        setSocket(createSocketInstance(accessToken));
        isConnectedRef.current = true;
    }, [])

    useEffect(() => {
        if (!socket) return;
        socket.on('connect', () => {
            console.log('%c🔌 Socket connected', 'color: green');
        });
        socket.on('disconnect', () => {
            console.log('%c❌ Socket disconnected', 'color: red');
            setSocket(undefined);
        });
        socket.on('connect_error', (error) => {
            console.error('%c⚠️ Socket connection error:', 'color: orange', error);
            setSocket(undefined);
        });
        return () => {
            socket.off('connect');
            socket.off('disconnect');
            socket.off('connect_error');
        };
    }, [socket]);

    const disconnect = useCallback(() => {
        socket?.disconnect();
        setSocket(undefined);
    }, [socket, setSocket])
    return (
        <SocketContext.Provider value={{
            socket,
            setSocket,
            disconnect
        }}>
            {children}
        </SocketContext.Provider>
    )
}