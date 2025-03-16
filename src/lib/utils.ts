import { clsx, type ClassValue } from "clsx"
import { UseFormSetError } from "react-hook-form"
import { twMerge } from "tailwind-merge"
import { EntityError } from "./http"
import { toast } from "sonner"
import jwt from "jsonwebtoken"
import authClientServices from "@/services/authClient.services"
import { DishStatus, OrderStatus, TableStatus } from "@/constants/type"

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

export const checkAndRefreshToken = async (handler?: {
  onError?: () => void
  onSuccess?: () => void
}) => {
  const accessToken = getAccessTokenFromLocalStorage()
  const refreshToken = getRefreshTokenFromLocalStorage()
  if (!accessToken || !refreshToken) return
  const decodedAccessToken = jwt.decode(accessToken) as {
    exp: number,
    iat: number
  }
  const decodedRefreshToken = jwt.decode(refreshToken) as {
    exp: number,
    iat: number
  }
  const currentTime = new Date().getTime() / 1000 - 1
  // const currentTime = Date.now() / 1000
  if (decodedRefreshToken.exp <= currentTime) {
    removeAccessTokenFromLocalStorage()
    removeRefreshTokenFromLocalStorage()
    return handler?.onError && handler.onError()
  }
  if (decodedAccessToken.exp - currentTime < (decodedAccessToken.exp - decodedAccessToken.iat) / 3) {
    try {
      const res = await authClientServices.refreshToken()
      setAccessTokenToLocalStorage(res.payload.data.accessToken)
      setRefreshTokenToLocalStorage(res.payload.data.refreshToken)
      return handler?.onSuccess && handler.onSuccess()
    } catch (error) {
      removeAccessTokenFromLocalStorage()
      removeRefreshTokenFromLocalStorage()
      return handler?.onError && handler.onError()
    }
  }
}

export const formatCurrency = (number: number) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(number)
}

export const getVietnameseDishStatus = (status: (typeof DishStatus)[keyof typeof DishStatus]) => {
  switch (status) {
    case DishStatus.Available:
      return 'Có sẵn'
    case DishStatus.Unavailable:
      return 'Không có sẵn'
    default:
      return 'Ẩn'
  }
}

export const getVietnameseOrderStatus = (status: (typeof OrderStatus)[keyof typeof OrderStatus]) => {
  switch (status) {
    case OrderStatus.Delivered:
      return 'Đã phục vụ'
    case OrderStatus.Paid:
      return 'Đã thanh toán'
    case OrderStatus.Pending:
      return 'Chờ xử lý'
    case OrderStatus.Processing:
      return 'Đang nấu'
    default:
      return 'Từ chối'
  }
}

export const getVietnameseTableStatus = (status: (typeof TableStatus)[keyof typeof TableStatus]) => {
  switch (status) {
    case TableStatus.Available:
      return 'Có sẵn'
    case TableStatus.Reserved:
      return 'Đã đặt'
    default:
      return 'Ẩn'
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