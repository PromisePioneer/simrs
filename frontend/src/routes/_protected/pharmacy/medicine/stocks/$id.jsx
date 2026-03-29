import { createFileRoute } from '@tanstack/react-router'
import MedicineStocks from "@features/medicine/pages/medicines/stocks/index.jsx";

export const Route = createFileRoute('/_protected/pharmacy/medicine/stocks/$id')({
    component: MedicineStocks,
})
