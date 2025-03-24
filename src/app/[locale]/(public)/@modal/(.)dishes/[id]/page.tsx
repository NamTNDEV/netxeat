import { dishApiServices } from "@/api/services/dishApi.services"
import { executeApiRequest } from "@/lib/utils"
import DishDetailModal from "./dish-detail.modal"
import DishDetail from "../../../dishes/[id]/dish-detail"

export default async function DishPage({
    params: { id }
}: {
    params: {
        id: string
    }
}) {
    const data = await executeApiRequest(() => dishApiServices.getDish(Number(id)))

    const dish = data?.payload?.data
    return (
        <DishDetailModal>
            <DishDetail dish={dish} />
        </DishDetailModal>
    )
}