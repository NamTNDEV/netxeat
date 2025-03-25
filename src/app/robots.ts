import configEnv from '@/configs/env.configs'
import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
    return {
        rules: {
            userAgent: '*',
            allow: '/'
        },
        sitemap: `${configEnv.NEXT_PUBLIC_URL}/sitemap.xml`
    }
}