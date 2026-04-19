import {createFileRoute} from '@tanstack/react-router'
import PatientPage from "@features/patients/pages/index.jsx";

export const Route = createFileRoute('/_protected/settings/patients/')({
    component: PatientPage,
})