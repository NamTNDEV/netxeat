'use client'

import { Role } from '@/constants/type'
import { cn, handleErrorApi } from '@/lib/utils'
import { useAuthContext } from '@/providers/auth-provider'
import { useLogoutMutation } from '@/queries/auth.queries'
import { useGuestLogoutMutation } from '@/queries/guest.queries'
import { RoleTypeValue } from '@/types/jwt.types'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

const menuItems: {
  title: string
  href: string
  role?: RoleTypeValue[]
  hideWhenLogin?: boolean
}[] = [
    {
      title: 'Trang chủ',
      href: '/'
    },
    {
      title: 'Menu',
      href: '/guest/menu',
      role: [Role.Guest]
    },
    {
      title: 'Đăng nhập',
      href: '/login',
      hideWhenLogin: true
    },
    {
      title: 'Quản lý',
      href: '/manage/dashboard',
      role: [Role.Owner, Role.Employee]
    }
  ]

export default function NavItems({ className }: { className?: string }) {
  const { roleState, setRole } = useAuthContext()
  const managerLogoutMutation = useLogoutMutation()
  const guestLogoutMutation = useGuestLogoutMutation()
  const router = useRouter()

  const logout = async () => {
    if (roleState === Role.Guest && guestLogoutMutation.isPending || managerLogoutMutation.isPending) return
    try {
      let { mutateAsync } = roleState === Role.Guest ? guestLogoutMutation : managerLogoutMutation
      await mutateAsync()
      setRole()
      router.push('/')
    } catch (error: any) {
      handleErrorApi({
        error
      })
    }
  }
  return (
    <>
      {menuItems.map((item) => {
        const isAuth = item.role && roleState && item.role.includes(roleState)
        const canShow =
          (item.role === undefined && !item.hideWhenLogin) ||
          (!roleState && item.hideWhenLogin)
        if (isAuth || canShow) {
          return (
            <Link href={item.href} key={item.href} className={className}>
              {item.title}
            </Link>
          )
        }
        return null
      })}
      {roleState && (
        <div className={cn(className, 'cursor-pointer')} onClick={logout}>
          Đăng xuất
        </div>
      )}
    </>
  )
}
