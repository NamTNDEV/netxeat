'use client'
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue
} from '@/components/ui/select'
import { Locale, locales } from '@/configs/locale.configs'
import { setUserLocale } from '@/services/locale'
import { useLocale, useTranslations } from 'next-intl'

export function SwitchLanguage() {
    const t = useTranslations('SwitchLanguage')
    const locale = useLocale()
    return (
        <Select
            value={locale}
            onValueChange={(value) => {
                setUserLocale(value as Locale)
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
    )
}