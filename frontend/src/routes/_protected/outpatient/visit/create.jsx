import {createFileRoute} from '@tanstack/react-router'
import OutpatientForm from "@features/outpatient/pages/form.jsx";

export const Route = createFileRoute('/_protected/outpatient/visit/create')({
    component: OutpatientForm,
});
