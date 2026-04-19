import {createFileRoute} from '@tanstack/react-router'
import InpatientForm from "@features/inpatient/pages/form.jsx";

export const Route = createFileRoute('/_protected/inpatient/create')({
    component: InpatientForm,
});
