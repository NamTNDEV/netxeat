'use client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Upload } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { UpdateMeBody, UpdateMeBodyType } from '@/schemaValidations/account.schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { Form, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useGetMeQuery, useUpdateMeMutation } from '@/queries/account.queries'
import { useUploadMediaMutation } from '@/queries/media.querires'
import { toast } from 'sonner'
import { handleErrorApi } from '@/lib/utils'

export default function UpdateProfileForm() {
  const { data, refetch } = useGetMeQuery()
  const updateMeMutation = useUpdateMeMutation()
  const updateMediaMutation = useUploadMediaMutation()

  const inputRef = useRef<HTMLInputElement>(null)
  const [uploadAvatarState, setUploadAvatarState] = useState<File | null>(null)

  const form = useForm<UpdateMeBodyType>({
    resolver: zodResolver(UpdateMeBody),
    defaultValues: {
      name: '',
      avatar: undefined
    }
  })

  const avatar = form.watch('avatar')
  const name = form.watch('name')

  const previewAvatar = useMemo(() => {
    if (uploadAvatarState) {
      return URL.createObjectURL(uploadAvatarState)
    }
    return avatar
  }, [avatar, uploadAvatarState])

  useEffect(() => {
    if (data) {
      const { avatar, name } = data.payload.data
      form.reset({
        name,
        avatar: avatar ?? undefined
      })
    }
  }, [data, form])

  const handleReset = () => {
    form.reset()
    setUploadAvatarState(null)
  }

  const handleSubmitForm = async (body: UpdateMeBodyType) => {
    if (updateMediaMutation.isPending) return
    try {
      let uploadBody = body;
      if (uploadAvatarState) {
        const formData = new FormData()
        formData.append('file', uploadAvatarState)
        const { payload } = await updateMediaMutation.mutateAsync(formData)
        uploadBody = {
          ...body,
          avatar: payload.data
        }
      }
      await updateMeMutation.mutateAsync(uploadBody)
      toast.success('Cập nhật thông tin thành công')
      refetch()
    } catch (error) {
      handleErrorApi({
        error,
        setError: form.setError
      })
    }
  }

  return (
    <Form {...form}>
      <form
        noValidate
        className='grid auto-rows-max items-start gap-4 md:gap-8'
        onReset={handleReset}
        onSubmit={form.handleSubmit(handleSubmitForm, (error) => {
          console.log("Error::: ", error)
        })}
      >
        <Card x-chunk='dashboard-07-chunk-0'>
          <CardHeader>
            <CardTitle>Thông tin cá nhân</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='grid gap-6'>
              <FormField
                control={form.control}
                name='avatar'
                render={({ field }) => (
                  <FormItem>
                    <div className='flex gap-2 items-start justify-start'>
                      <Avatar className='aspect-square w-[100px] h-[100px] rounded-md object-cover'>
                        <AvatarImage src={previewAvatar} />
                        <AvatarFallback className='rounded-none'>{name}</AvatarFallback>
                      </Avatar>
                      <input type='file' accept='image/*'
                        className='hidden' ref={inputRef}
                        onChange={e => {
                          const file = e.target.files?.[0]
                          if (file) {
                            setUploadAvatarState(file)
                          }
                        }}
                      />
                      <button
                        className='flex aspect-square w-[100px] items-center justify-center rounded-md border border-dashed'
                        type='button'
                        onClick={() => inputRef.current?.click()}
                      >
                        <Upload className='h-4 w-4 text-muted-foreground' />
                        <span className='sr-only'>Upload</span>
                      </button>
                    </div>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='name'
                render={({ field }) => (
                  <FormItem>
                    <div className='grid gap-3'>
                      <Label htmlFor='name'>Tên</Label>
                      <Input id='name' type='text' className='w-full' {...field} />
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />

              <div className=' items-center gap-2 md:ml-auto flex'>
                <Button variant='outline' size='sm' type='reset'>
                  Hủy
                </Button>
                <Button size='sm' type='submit'>
                  Lưu thông tin
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </form>
    </Form>
  )
}
