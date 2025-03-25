import { Locale } from "@/configs/locale.configs";
import GuestLoginForm from "./guest-login-form";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import configEnv from "@/configs/env.configs";

type Props = {
  params: { number: string; locale: Locale }
  searchParams: { [key: string]: string | string[] | undefined }
}
export async function generateMetadata({
  params,
}: Props): Promise<Metadata> {
  const t = await getTranslations({
    locale: params.locale,
    namespace: 'LoginGuest'
  })

  const url =
    configEnv.NEXT_PUBLIC_URL + `/${params.locale}/tables/${params.number}`

  return {
    title: `No ${params.number} | ${t('title')}`,
    description: t('description'),
    alternates: {
      canonical: url
    },
    robots: {
      index: false
    }
  }
}

export default function TableNumberPage() {
  return <GuestLoginForm />
}
