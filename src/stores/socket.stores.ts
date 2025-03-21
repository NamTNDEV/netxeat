import { create } from 'zustand';
import { Socket } from 'socket.io-client';
import { createSocketInstance } from "@/lib/socket";
import { getAccessTokenFromLocalStorage } from "@/lib/utils";

interface SocketStore {
    isConnected: boolean;
    connect: () => void;
    disconnect: () => void;
    socket: Socket | undefined;
    setSocket: (socket: Socket | undefined) => void;
}

export const useSocketStore = create<SocketStore>((set) => ({
    isConnected: false,
    socket: undefined,
    setSocket: (socket: Socket | undefined) => {
        set({
            socket,
            isConnected: !!socket
        })
    },
    connect: () => {
        const accessToken = getAccessTokenFromLocalStorage()
        if (!accessToken) return;
        const socketInstance = createSocketInstance(accessToken)
        set({
            socket: socketInstance,
            isConnected: true
        })
    },
    disconnect: () => {
        set((state) => {
            state.socket?.disconnect()
            return {
                socket: undefined,
                isConnected: false
            }
        })
    }
}));