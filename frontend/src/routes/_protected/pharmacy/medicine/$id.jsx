import { createFileRoute } from '@tanstack/react-router'
import MedicineForm from "@/pages/pharmacy/medicines/form.jsx";

export const Route = createFileRoute('/_protected/pharmacy/medicine/$id')({
    component: MedicineForm,
});
