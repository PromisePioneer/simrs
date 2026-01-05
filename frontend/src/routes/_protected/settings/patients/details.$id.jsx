import {createFileRoute} from '@tanstack/react-router'
import PatientDetailPage from '@/pages/settings/patients/details.jsx'

export const Route = createFileRoute('/_protected/settings/patients/details/$id')({
    component: PatientDetailPage,
})