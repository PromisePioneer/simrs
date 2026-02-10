import {createFileRoute} from '@tanstack/react-router'
import MedicineForm from "@/pages/settings/medicine-management/medicines/form.jsx";

export const Route = createFileRoute(
    '/_protected/settings/medicine-management/medicine/$id',
)({
    component: MedicineForm,
});