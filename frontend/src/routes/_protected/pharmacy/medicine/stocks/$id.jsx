import { createFileRoute } from '@tanstack/react-router'
import MedicineStocks from "@/pages/settings/medicine-management/medicines/stocks/index.jsx";

export const Route = createFileRoute('/_protected/pharmacy/medicine/stocks/$id')({
    component: MedicineStocks,
})
