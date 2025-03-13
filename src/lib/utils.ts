import { clsx, type ClassValue } from "clsx"
import { UseFormSetError } from "react-hook-form"
import { twMerge } from "tailwind-merge"
import { EntityError } from "./http"
import { toast } from "sonner"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const normalizePath = (path: string) => {
  return path.startsWith('/') ? path.slice(1) : path
}

export const handleErrorApi = ({
  error,
  setError,
  toasterDuration = 5000
}: {
  error: any,
  setError?: UseFormSetError<any>,
  toasterDuration?: number
}) => {
  if (error instanceof EntityError && setError) {
    error.payload.errors.forEach((err) => {
      setError(err.field, { type: 'server', message: err.message });
    });
  } else {
    toast.error(error?.payload?.message || "Internal Server Error", {
      duration: toasterDuration
    })
  }
}

const isBrowser = typeof window !== "undefined"

export const getAccessTokenFromLocalStorage = () => isBrowser ? localStorage.getItem("accessToken") : null
export const getRefreshTokenFromLocalStorage = () => isBrowser ? localStorage.getItem("refreshToken") : null
export const setAccessTokenToLocalStorage = (accessToken: string) => isBrowser && localStorage.setItem("accessToken", accessToken)
export const setRefreshTokenToLocalStorage = (refreshToken: string) => isBrowser && localStorage.setItem("refreshToken", refreshToken)
export const removeAccessTokenFromLocalStorage = () => isBrowser && localStorage.removeItem("accessToken")
export const removeRefreshTokenFromLocalStorage = () => isBrowser && localStorage.removeItem("refreshToken")
export const clearLocalStorage = () => isBrowser && localStorage.clear()