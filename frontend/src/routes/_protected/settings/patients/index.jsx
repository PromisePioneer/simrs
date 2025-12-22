import {createFileRoute} from '@tanstack/react-router'
import PatientPage from "@/pages/settings/patients/index.jsx";

export const Route = createFileRoute('/_protected/settings/patients/')({
    component: PatientPage,
})