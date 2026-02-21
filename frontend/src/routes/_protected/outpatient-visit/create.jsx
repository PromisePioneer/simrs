import {createFileRoute} from '@tanstack/react-router'
import OutpatientForm from "@/pages/outpatient-visit/form.jsx";

export const Route = createFileRoute('/_protected/outpatient-visit/create')({
    component: OutpatientForm,
});
