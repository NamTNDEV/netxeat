'use client'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useForm } from 'react-hook-form'
import { Form, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { LoginBody, LoginBodyType } from '@/schemaValidations/auth.schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { useLoginMutation } from '@/queries/auth.queries'
import { handleErrorApi } from '@/lib/utils'
import { toast } from 'sonner'
import { useRouter } from '@/i18n/navigation'
import { useEffect } from 'react'
import { createSocketInstance } from '@/lib/socket'
import { useAuthStore } from '@/stores/auth.stores'
import { useSocketStore } from '@/stores/socket.stores'
import SearchParamsLoader, { useSearchParamsLoader } from '@/components/common/search-params-loader'
import { useTranslations } from 'next-intl'
import { LoaderCircle } from 'lucide-react'

export default function LoginForm() {
  const t = useTranslations('Login')
  const errorMessageT = useTranslations('ErrorMessage')
  const { searchParams, setSearchParams } = useSearchParamsLoader()
  const loginMutation = useLoginMutation()
  const router = useRouter()
  const isClearTokens = searchParams?.get('isClearTokens')
  const { setRole } = useAuthStore()
  const { setSocket } = useSocketStore()

  const form = useForm<LoginBodyType>({
    resolver: zodResolver(LoginBody),
    defaultValues: {
      email: '',
      password: ''
    }
  })

  useEffect(() => {
    if (isClearTokens) {
      setRole()
    }
  }, [isClearTokens, setRole])

  const onSubmit = async (data: LoginBodyType) => {
    if (loginMutation.isPending) return
    try {
      const result = await loginMutation.mutateAsync(data)
      toast.success(result.payload.message)
      setRole(result.payload.data.account.role)
      setSocket(createSocketInstance(result.payload.data.accessToken))
      router.push('/')
    } catch (error: any) {
      handleErrorApi({
        error,
        setError: form.setError
      })
    }
  }

  return (
    <Card className='mx-auto max-w-sm'>
      <SearchParamsLoader onParamsReceived={setSearchParams} />
      <CardHeader>
        <CardTitle className='text-2xl'>{t('title')}</CardTitle>
        <CardDescription>{t('cardDescription')}</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form className='space-y-2 max-w-[600px] flex-shrink-0 w-full' noValidate
            onSubmit={form.handleSubmit(onSubmit, (errors) => console.error(errors))}>
            <div className='grid gap-4'>
              <FormField
                control={form.control}
                name='email'
                render={({ field, formState: { errors } }) => (
                  <FormItem>
                    <div className='grid gap-2'>
                      <Label htmlFor='email'>Email</Label>
                      <Input id='email' type='email' placeholder='m@example.com' required {...field} autoComplete={'email'} />
                      <FormMessage>
                        {Boolean(errors.email?.message) &&
                          errorMessageT(errors.email?.message as any)}
                      </FormMessage>
                    </div>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='password'
                render={({ field, formState: { errors } }) => (
                  <FormItem>
                    <div className='grid gap-2'>
                      <div className='flex items-center'>
                        <Label htmlFor='password'>{t('password')}</Label>
                      </div>
                      <Input id='password' type='password' required {...field} autoComplete={'current-password'} />
                      <FormMessage>
                        {Boolean(errors.password?.message) &&
                          errorMessageT(errors.password?.message as any)}
                      </FormMessage>
                    </div>
                  </FormItem>
                )}
              />
              <Button type='submit' className='w-full'>
                {loginMutation.isPending && (
                  <LoaderCircle className='w-5 h-5 mr-2 animate-spin' />
                )}
                {t('buttonLogin')}
              </Button>
              {/* <Button variant='outline' className='w-full' type='button'>
                  Đăng nhập bằng Google
                </Button> */}
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
