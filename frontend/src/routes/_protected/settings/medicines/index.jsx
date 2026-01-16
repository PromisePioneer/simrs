import {createFileRoute} from '@tanstack/react-router'
import MedicinePage from "@/pages/settings/medicines/index.jsx";
import { z } from 'zod'

const medicineSearchSchema = z.object({
    tab: z.enum(['medicines', 'medicine_categories', 'medicine_warehouses']).optional().default('medicines')
})

export const Route = createFileRoute('/_protected/settings/medicines/')({
    validateSearch: medicineSearchSchema,
    component: MedicinePage,
})
