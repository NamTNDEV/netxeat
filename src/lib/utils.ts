import { clsx, type ClassValue } from "clsx"
import { UseFormSetError } from "react-hook-form"
import { twMerge } from "tailwind-merge"
import { EntityError } from "./http"
import { toast } from "sonner"
import jwt from "jsonwebtoken"
import authClientServices from "@/services/authClient.services"
import { DishStatus, OrderStatus, Role, TableStatus } from "@/constants/type"
import configEnv from "@/configs/env.configs"
import { TokenPayloadType } from "@/types/jwt.types"
import guestClientServices from "@/services/guestClient.services"
import { format } from "date-fns"
import { BookX, CookingPot, HandCoins, Loader, Truck } from 'lucide-react'
import slugify from 'slugify'
import { convert } from "html-to-text"

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

export const getTableLink = ({ token, tableNumber }: { token: string; tableNumber: number }) => {
  return configEnv.NEXT_PUBLIC_URL + '/tables/' + tableNumber + '?token=' + token
}

export const getStatusIcon = (status: string) => {
  switch (status) {
    case "COMPLETED":
      return "check-circle"
    case "PENDING":
      return "clock"
    case "PROCESSING":
      return "refresh-cw"
    case "CANCELLED":
      return "x-circle"
    default:
      return "help-circle"
  }
}

export function removeAccents(str: string) {
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
}

export const simpleMatchText = (fullText: string, matchText: string) => {
  return removeAccents(fullText.toLowerCase()).includes(removeAccents(matchText.trim().toLowerCase()))
}

export const formatDateTimeToLocaleString = (date: string | Date) => {
  return format(
    date instanceof Date ? date : new Date(date),
    'HH:mm:ss dd/MM/yyyy'
  )
}

export const formatDateTimeToTimeString = (date: string | Date) => {
  return format(date instanceof Date ? date : new Date(date), 'HH:mm:ss')
}

export const executeApiRequest = async <T>(fn: () => Promise<T>) => {
  let result = null
  try {
    result = await fn()
  } catch (error: any) {
    console.error("API Request Error:", error);
    if (error.digest?.includes('NEXT_REDIRECT')) {
      throw error
    }
  }
  return result
}

export const OrderStatusIcon = {
  [OrderStatus.Pending]: Loader,
  [OrderStatus.Processing]: CookingPot,
  [OrderStatus.Rejected]: BookX,
  [OrderStatus.Delivered]: Truck,
  [OrderStatus.Paid]: HandCoins
}

export const generateSlugUrl = (name: string, id: number) => `${slugify(name)}-id.${id}`
export const getIdFromSlug = (slug: string) => slug.split('-id.')[1]

export const htmlToTextForDescription = (html: string) => {
  return convert(html, {
    limits: {
      maxInputLength: 140
    }
  })
}

// Local Storage
export const getAccessTokenFromLocalStorage = () => (typeof window !== "undefined") ? localStorage.getItem("accessToken") : null
export const getRefreshTokenFromLocalStorage = () => (typeof window !== "undefined") ? localStorage.getItem("refreshToken") : null
export const setAccessTokenToLocalStorage = (accessToken: string) => (typeof window !== "undefined") && localStorage.setItem("accessToken", accessToken)
export const setRefreshTokenToLocalStorage = (refreshToken: string) => (typeof window !== "undefined") && localStorage.setItem("refreshToken", refreshToken)
export const removeAccessTokenFromLocalStorage = () => (typeof window !== "undefined") && localStorage.removeItem("accessToken")
export const removeRefreshTokenFromLocalStorage = () => (typeof window !== "undefined") && localStorage.removeItem("refreshToken")
export const clearLocalStorage = () => (typeof window !== "undefined") && localStorage.clear()

// JWT
export const decodeToken = (token: string) => {
  return jwt.decode(token) as TokenPayloadType
}

export const checkAndRefreshToken = async (handler?: {
  onError?: () => void
  onSuccess?: () => void
  isForceRefresh?: boolean
}) => {
  const accessToken = getAccessTokenFromLocalStorage()
  const refreshToken = getRefreshTokenFromLocalStorage()
  if (!accessToken || !refreshToken) return
  const decodedAccessToken = decodeToken(accessToken)
  const decodedRefreshToken = decodeToken(refreshToken)
  const currentTime = new Date().getTime() / 1000 - 1
  // const currentTime = Date.now() / 1000
  if (decodedRefreshToken.exp <= currentTime) {
    removeAccessTokenFromLocalStorage()
    removeRefreshTokenFromLocalStorage()
    return handler?.onError && handler.onError()
  }
  if (handler?.isForceRefresh || (decodedAccessToken.exp - currentTime < (decodedAccessToken.exp - decodedAccessToken.iat) / 3)) {
    try {
      const { role } = decodedAccessToken
      const res = role === Role.Guest ? (await guestClientServices.refreshToken()) : (await authClientServices.refreshToken())
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

