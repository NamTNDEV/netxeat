'use client'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Link } from '@/i18n/navigation'
import { useRouter } from '@/i18n/navigation'
import { useLogoutMutation } from '@/queries/auth.queries'
import { handleErrorApi } from '@/lib/utils'
import { toast } from 'sonner'
import { useGetMeQuery } from '@/queries/account.queries'
import { useAuthStore } from '@/stores/auth.stores'
import { useSocketStore } from '@/stores/socket.stores'

export default function DropdownAvatar() {
  const route = useRouter();
  const logoutMutation = useLogoutMutation();
  const { data } = useGetMeQuery();
  const account = data?.payload.data;
  const { setRole } = useAuthStore();
  const { disconnect: disconnectSocket } = useSocketStore()


  const handleLogout = async () => {
    if (logoutMutation.isPending) return;
    try {
      await logoutMutation.mutateAsync();
      toast.success('Đăng xuất thành công');
      setRole();
      disconnectSocket();
      route.push('/login');
    } catch (error) {
      handleErrorApi({
        error
      })
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant='outline' size='icon' className='overflow-hidden rounded-full'>
          <Avatar>
            <AvatarImage src={account?.avatar ?? undefined} alt={account?.name} />
            <AvatarFallback>{account?.name.slice(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end'>
        <DropdownMenuLabel>{account?.name}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href={'/manage/setting'} className='cursor-pointer'>
            Cài đặt
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem>Hỗ trợ</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout}>Đăng xuất</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
