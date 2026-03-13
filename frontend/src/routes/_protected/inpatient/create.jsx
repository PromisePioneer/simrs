import {createFileRoute} from '@tanstack/react-router'
import InpatientForm from "@/pages/inpatient/form.jsx";

export const Route = createFileRoute('/_protected/inpatient/create')({
    component: InpatientForm,
});
