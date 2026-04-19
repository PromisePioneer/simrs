import {createFileRoute} from '@tanstack/react-router'
import PatientForm from "@features/patients/pages/form.jsx";

export const Route = createFileRoute('/_protected/settings/patients/create')({
    component: PatientForm,
})
