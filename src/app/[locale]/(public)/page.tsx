import { dishApiServices } from "@/api/services/dishApi.services"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { formatCurrency } from "@/lib/utils"
import { DishListResType } from "@/schemaValidations/dish.schema"
import { getTranslations, setRequestLocale } from "next-intl/server"
import Image from "next/image"
import { Link } from '@/i18n/navigation'
import { Locale } from "@/configs/locale.configs"

export default async function Home({ params: { locale } }: { params: { locale: Locale } }) {
  setRequestLocale(locale);
  const t = await getTranslations('HomePage')
  let dishList: DishListResType['data'] = []

  try {
    const res = await dishApiServices.getDishes()
    const { payload: { data } } = res
    dishList = data
  } catch (error) {
    return <div>Something went wrong</div>
  }

  return (
    <div className='w-full space-y-4'>
      <div className='relative'>
        <span className='absolute top-0 left-0 w-full h-full bg-black opacity-50 z-10'></span>
        <Image
          src='/banner.png'
          width={400}
          height={200}
          quality={100}
          alt='Banner'
          priority
          className='absolute top-0 left-0 w-full h-full object-cover'
        />
        <div className='z-20 relative py-10 md:py-20 px-4 sm:px-10 md:px-20'>
          <h1 className='text-center text-xl sm:text-2xl md:text-4xl lg:text-5xl font-bold'>{t('title')}</h1>
          <p className='text-center text-sm sm:text-base mt-4'>{t('subtitle')}</p>
        </div>
      </div>
      <section className="space-y-10 py-16">
        <h2 className="text-center text-2xl font-bold text-white">
          {t('header')}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {dishList.map((dishItem) => (
            <TooltipProvider key={dishItem.id}>
              <Tooltip>
                <TooltipTrigger>
                  <Link href={`/dishes/${dishItem.id}`}>
                    <div className="flex flex-col sm:flex-row bg-gray-900 rounded-lg p-4 hover:opacity-80 transition-opacity cursor-pointer relative">
                      {/* Hình tròn nhỏ góc trên bên trái */}
                      <div className="absolute top-2 left-2 w-12 h-12 rounded-full bg-gray-700 text-white dark:text-white flex items-center justify-center text-sm font-semibold">
                        ID: {dishItem.id}
                      </div>
                      {/* Ảnh món ăn */}
                      <div className="w-full sm:w-48 h-48 overflow-hidden rounded-md flex-shrink-0">
                        <Image
                          width={200}
                          height={200}
                          quality={100}
                          alt={dishItem.name}
                          src={dishItem.image}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* Thông tin món ăn */}
                      <div className="flex flex-col justify-between px-4 py-2 w-full">
                        <div className='flex flex-col space-y-1'>
                          <h3 className="text-xl font-semibold text-white line-clamp-1">{dishItem.name}</h3>
                          <p className="pl-2 text-gray-400 line-clamp-3">{dishItem.description}</p>
                        </div>
                        <p className="font-semibold text-yellow-400">
                          {formatCurrency(dishItem.price)}
                        </p>
                      </div>
                    </div>
                  </Link>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{dishItem.name}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ))}
        </div>
      </section>
    </div>
  )
}