import indicatorsApiServices from "@/api/services/indicator"
import { DashboardIndicatorQueryParamsType } from "@/schemaValidations/indicator.schema"
import { useQuery } from "@tanstack/react-query"

export const useDashboardIndicatorsQuery = (queryParams: DashboardIndicatorQueryParamsType) => {
    return useQuery({
        queryKey: ["dashboard-indicators"],
        queryFn: () => indicatorsApiServices.getDashboardIndicators(queryParams)
    })
}