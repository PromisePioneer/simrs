import { createFileRoute } from '@tanstack/react-router'
import MedicineWarehouseForm from "@features/medicine/pages/warehouses /form.jsx";

export const Route = createFileRoute('/_protected/pharmacy/warehouse/create')({
    component: MedicineWarehouseForm,
})
