'use client'

import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { Role } from '@/constants/type'
import { Link, useRouter } from '@/i18n/navigation'
import { cn, handleErrorApi } from '@/lib/utils'
import { useLogoutMutation } from '@/queries/auth.queries'
import { useGuestLogoutMutation } from '@/queries/guest.queries'
import { useAuthStore } from '@/stores/auth.stores'
import { useSocketStore } from '@/stores/socket.stores'
import { RoleTypeValue } from '@/types/jwt.types'
import { createTranslator, Messages } from 'next-intl'
import { NamespaceKeys, NestedKeyOf, useTranslations } from 'use-intl'


const menuItems: {
  title: string
  href: string
  role?: RoleTypeValue[]
  hideWhenLogin?: boolean,
}[] = [
    {
      title: 'home',
      href: '/'
    },
    {
      title: 'menu',
      href: '/guest/order-menu',
      role: [Role.Guest]
    },
    {
      title: 'orders',
      href: '/guest/order-history',
      role: [Role.Guest]
    },
    {
      title: 'login',
      href: '/login',
      hideWhenLogin: true
    },
    {
      title: 'manage',
      href: '/manage/dashboard',
      role: [Role.Owner, Role.Employee]
    }
  ]

export default function NavItems({ className }: { className?: string }) {
  const t = useTranslations('NavItem')
  const { role, setRole } = useAuthStore()
  const { disconnect: disconnectSocket } = useSocketStore()
  const managerLogoutMutation = useLogoutMutation()
  const guestLogoutMutation = useGuestLogoutMutation()
  const router = useRouter()

  const logout = async () => {
    if (role === Role.Guest && guestLogoutMutation.isPending || managerLogoutMutation.isPending) return
    try {
      const { mutateAsync } = role === Role.Guest ? guestLogoutMutation : managerLogoutMutation
      await mutateAsync()
      setRole()
      disconnectSocket()
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
        const isAuth = item.role && role && item.role.includes(role)
        const canShow =
          (item.role === undefined && !item.hideWhenLogin) ||
          (!role && item.hideWhenLogin)
        if (isAuth || canShow) {
          return (
            <Link href={item.href} key={item.href} className={className}>
              {t(item.title as any)}
            </Link>
          )
        }
        return null
      })}
      {role && (
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <div className={cn(className, 'cursor-pointer')}>{t('logout')}</div>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>{t('logoutDialog.logoutQuestion')}</AlertDialogTitle>
              <AlertDialogDescription>
                {t('logoutDialog.logoutConfirm')}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>{t('logoutDialog.logoutCancel')}</AlertDialogCancel>
              <AlertDialogAction onClick={logout}>OK</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </>
  )
}
