import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'
import PharmacyPage from "@features/medicine/pages/pharmacy/index.jsx";

const pharmacySearchSchema = z.object({
    tab: z.enum(['medicine-management', 'medicine_categories', 'medicine_warehouses', 'medicine_stock_movements']).optional().default('medicine-management')
})

export const Route = createFileRoute('/_protected/pharmacy/')(({
    validateSearch: pharmacySearchSchema,
    component: PharmacyPage,
}))
