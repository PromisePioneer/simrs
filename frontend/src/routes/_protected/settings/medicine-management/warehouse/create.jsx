import {createFileRoute} from '@tanstack/react-router'
import MedicineWarehouseForm from "@/pages/settings/medicine-management/warehouses /form.jsx";

export const Route = createFileRoute(
    '/_protected/settings/medicine-management/warehouse/create',
)({
    component: MedicineWarehouseForm,
})
