import { dishApiServices } from "@/api/services/dishApi.services"
import { executeApiRequest, getIdFromSlug } from "@/lib/utils"
import DishDetailModal from "./dish-detail.modal"
import DishDetail from "../../../dishes/[slug]/dish-detail"
import { setRequestLocale } from "next-intl/server"
import { Locale } from "@/configs/locale.configs"

export default async function DishPage({
    params: { slug, locale }
}: {
    params: {
        slug: string,
        locale: Locale
    }
}) {
    setRequestLocale(locale);
    const data = await executeApiRequest(() => dishApiServices.getDish(Number(getIdFromSlug(slug))))

    const dish = data?.payload?.data
    return (
        <DishDetailModal>
            <DishDetail dish={dish} />
        </DishDetailModal>
    )
}