import { createFileRoute } from '@tanstack/react-router'
import MedicineWarehouseForm from "@/pages/settings/medicine-management/warehouses /form.jsx";

export const Route = createFileRoute('/_protected/pharmacy/warehouse/create')({
    component: MedicineWarehouseForm,
})
