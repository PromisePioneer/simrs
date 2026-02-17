import {createFileRoute} from '@tanstack/react-router'
import OutpatientForm from "@/pages/outpatient/form.jsx";

export const Route = createFileRoute('/_protected/outpatient/create')({
    component: OutpatientForm,
});
