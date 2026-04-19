import { createFileRoute } from '@tanstack/react-router'
import MedicineForm from "@features/medicine/pages/pharmacy/medicines/form.jsx";

export const Route = createFileRoute('/_protected/pharmacy/medicine/create')({
    component: MedicineForm,
});
