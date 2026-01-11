import {createFileRoute} from '@tanstack/react-router'
import MedicineWarehouseForm from "@/pages/settings/medicines/warehouses /form.jsx";

export const Route = createFileRoute(
    '/_protected/settings/medicines/warehouse/create',
)({
    component: MedicineWarehouseForm,
})
