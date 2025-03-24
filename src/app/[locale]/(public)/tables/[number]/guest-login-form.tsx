'use client'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useForm } from 'react-hook-form'
import { Form, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { zodResolver } from '@hookform/resolvers/zod'
import { GuestLoginBody, GuestLoginBodyType } from '@/schemaValidations/guest.schema'
import { useParams, useSearchParams } from 'next/navigation'
import { useRouter } from '@/i18n/navigation'
import { useEffect } from 'react'
import { useGuestLoginMutation } from '@/queries/guest.queries'
import { handleErrorApi } from '@/lib/utils'
import { createSocketInstance } from '@/lib/socket'
import { useAuthStore } from '@/stores/auth.stores'
import { useSocketStore } from '@/stores/socket.stores'

export default function GuestLoginForm() {
  const router = useRouter()
  const params = useParams()
  const searchParams = useSearchParams()
  const token = searchParams.get('token')
  const tableNumber = Number(params.number)

  const { setRole } = useAuthStore()
  const { setSocket } = useSocketStore()

  const loginMutation = useGuestLoginMutation()

  const form = useForm<GuestLoginBodyType>({
    resolver: zodResolver(GuestLoginBody),
    defaultValues: {
      name: '',
      token: token as string,
      tableNumber
    }
  })

  useEffect(() => {
    if (!token || !tableNumber) {
      router.push("/")
    }
  }, [token, tableNumber, router])

  const handleSubmit = async (data: GuestLoginBodyType) => {
    if (loginMutation.isPending) return
    try {
      const result = await loginMutation.mutateAsync(data)
      setRole(result.payload.data.guest.role)
      setSocket(createSocketInstance(result.payload.data.accessToken))
      router.push("/guest/order-menu")
    } catch (error) {
      handleErrorApi({
        error,
        setError: form.setError
      })
    }
  }

  return (
    <Card className='mx-auto max-w-sm'>
      <CardHeader>
        <CardTitle className='text-2xl'>Đăng nhập gọi món</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form className='space-y-2 max-w-[600px] flex-shrink-0 w-full' noValidate onSubmit={form.handleSubmit(handleSubmit)}>
            <div className='grid gap-4'>
              <FormField
                control={form.control}
                name='name'
                render={({ field }) => (
                  <FormItem>
                    <div className='grid gap-2'>
                      <Label htmlFor='name'>Tên khách hàng</Label>
                      <Input id='name' type='text' required {...field} />
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />

              <Button type='submit' className='w-full'>
                Đăng nhập
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
