import {createFileRoute} from '@tanstack/react-router'
import MedicineWarehouseForm from "@features/medicine/pages/pharmacy/warehouses/form.jsx";

export const Route = createFileRoute(
    '/_protected/settings/medicine-management/warehouse/$id',
)({
    component: MedicineWarehouseForm,
})