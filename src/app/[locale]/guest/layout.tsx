import Layout from '@/app/[locale]/(public)/layout'
import { defaultLocale } from '@/configs/locale.configs'

export default function GuestLayout({
    children
}: Readonly<{ children: React.ReactNode }>) {
    return <Layout params={{ locale: defaultLocale }} modal={null}>{children}</Layout>
}