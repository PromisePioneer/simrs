import {createFileRoute} from '@tanstack/react-router'
import PatientForm from "@/pages/settings/patients/form.jsx";

export const Route = createFileRoute('/_protected/settings/patients/create')({
    component: PatientForm,
})
