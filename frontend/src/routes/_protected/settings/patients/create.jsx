import {createFileRoute} from '@tanstack/react-router'
import PatientForm from "@/pages/settings/patients/create.jsx";

export const Route = createFileRoute('/_protected/settings/patients/create')({
    component: PatientForm,
})
