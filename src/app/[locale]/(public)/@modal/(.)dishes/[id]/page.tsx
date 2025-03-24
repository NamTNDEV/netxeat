import { dishApiServices } from "@/api/services/dishApi.services"
import { executeApiRequest } from "@/lib/utils"
import DishDetailModal from "./dish-detail.modal"
import DishDetail from "../../../dishes/[id]/dish-detail"
import { setRequestLocale } from "next-intl/server"
import { Locale } from "@/configs/locale.configs"

export default async function DishPage({
    params: { id, locale }
}: {
    params: {
        id: string,
        locale: Locale
    }
}) {
    setRequestLocale(locale);
    const data = await executeApiRequest(() => dishApiServices.getDish(Number(id)))

    const dish = data?.payload?.data
    return (
        <DishDetailModal>
            <DishDetail dish={dish} />
        </DishDetailModal>
    )
}