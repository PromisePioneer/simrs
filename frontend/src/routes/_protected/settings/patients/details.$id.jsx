import {createFileRoute} from '@tanstack/react-router'
import PatientDetailPage from '@features/patients/pages/details.jsx'

export const Route = createFileRoute('/_protected/settings/patients/details/$id')({
    component: PatientDetailPage,
})