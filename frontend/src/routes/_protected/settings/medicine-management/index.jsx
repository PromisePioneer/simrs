import {createFileRoute} from '@tanstack/react-router'
import {z} from 'zod'
import MedicineManagementPage from "@/pages/settings/medicine-management/index.jsx";

const medicineSearchSchema = z.object({
    tab: z.enum(['medicine-management', 'medicine_categories', 'medicine_warehouses', 'medicine_stock_movements']).optional().default('medicine-management')
})

export const Route = createFileRoute('/_protected/settings/medicine-management/')({
    validateSearch: medicineSearchSchema,
    component: MedicineManagementPage,
})
