import { dishApiServices } from "@/api/services/dishApi.services";
import configEnv from "@/configs/env.configs";
import { locales } from "@/configs/locale.configs";
import { generateSlugUrl } from "@/lib/utils";
import { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    // Static sitemap
    const staticSiteMap = [
        {
            url: '',
            changeFrequency: 'weekly' as const,
            priority: 1
        },
        {
            url: '/login',
            changeFrequency: 'yearly' as const,
            priority: 0.5
        }
    ]

    const localizeStaticSitemap = locales.reduce((acc, locale) => {
        return [
            ...acc,
            ...staticSiteMap.map((item) => ({
                ...item,
                url: `${configEnv.NEXT_PUBLIC_URL}/${locale}${item.url}`,
                lastModified: new Date()
            }))
        ]
    }, [] as MetadataRoute.Sitemap)

    // Dynamic sitemap
    const dishList = (await dishApiServices.getDishes()).payload.data
    const localizeDishDynamicSitemap: MetadataRoute.Sitemap = locales.reduce((acc, locale) => {
        const dishListSiteMap: MetadataRoute.Sitemap = dishList.map((dish) => {
            return {
                url: `${configEnv.NEXT_PUBLIC_URL}/${locale}/dishes/${generateSlugUrl(dish.name, dish.id)}`,
                lastModified: dish.updatedAt,
                changeFrequency: 'weekly' as const,
                priority: 0.9
            }
        })
        return [...acc, ...dishListSiteMap]
    }, [] as MetadataRoute.Sitemap)

    return [...localizeStaticSitemap, ...localizeDishDynamicSitemap]
}