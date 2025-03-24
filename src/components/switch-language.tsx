'use client'
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue
} from '@/components/ui/select'
import { Locale, locales } from '@/configs/locale.configs'
import { useLocale, useTranslations } from 'next-intl'
import SearchParamsLoader, { useSearchParamsLoader } from './common/search-params-loader'
import { usePathname, useRouter } from '@/i18n/navigation'

export function SwitchLanguage() {
    const { searchParams, setSearchParams } = useSearchParamsLoader()
    const t = useTranslations('SwitchLanguage')
    const locale = useLocale()
    const pathname = usePathname()
    const router = useRouter()
    return (
        <>
            <SearchParamsLoader onParamsReceived={setSearchParams} />
            <Select
                value={locale}
                onValueChange={(value) => {
                    router.replace(pathname, {
                        locale: value as Locale,
                    })
                    router.refresh()
                }}
            >
                <SelectTrigger className='w-[140px]'>
                    <SelectValue placeholder={t('title')} />
                </SelectTrigger>
                <SelectContent>
                    <SelectGroup>
                        {locales.map((locale) => (
                            <SelectItem value={locale} key={locale}>
                                {t(locale)}
                            </SelectItem>
                        ))}
                    </SelectGroup>
                </SelectContent>
            </Select>
        </>
    )
}