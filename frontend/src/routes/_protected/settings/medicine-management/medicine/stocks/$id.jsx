import {createFileRoute} from '@tanstack/react-router'
import MedicineStocks from "@features/medicine/pages/pharmacy/medicines/stocks/index.jsx";

export const Route = createFileRoute(
    '/_protected/settings/medicine-management/medicine/stocks/$id',
)({
    component: MedicineStocks,
})
