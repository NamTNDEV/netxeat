import http from "@/lib/http";
import { DishListResType } from "@/schemaValidations/dish.schema";

const prefix = 'dishes';

export const dishApiServices = {
    getDishes: () => http.get<DishListResType>(`${prefix}`),
}