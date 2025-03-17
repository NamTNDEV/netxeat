import http from "@/lib/http";
import { CreateTableBodyType, TableListResType, TableResType, UpdateTableBodyType } from "@/schemaValidations/table.schema";

const prefix = '/tables';

export const tableApiServices = {
    getTables: () => http.get<TableListResType>(`${prefix}`),
    getTable: (id: number) => http.get<TableResType>(`${prefix}/${id}`),
    createTable: (body: CreateTableBodyType) => http.post<TableResType>(`${prefix}`, body),
    updateTable: (id: number, body: UpdateTableBodyType) => http.put<TableResType>(`${prefix}/${id}`, body),
    deleteTable: (id: number) => http.delete<TableResType>(`${prefix}/${id}`)
}