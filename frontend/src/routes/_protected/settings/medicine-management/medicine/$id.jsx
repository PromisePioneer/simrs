import {createFileRoute} from '@tanstack/react-router'
import MedicineForm from "@features/medicine/pages/medicines/form.jsx";

export const Route = createFileRoute(
    '/_protected/settings/medicine-management/medicine/$id',
)({
    component: MedicineForm,
});