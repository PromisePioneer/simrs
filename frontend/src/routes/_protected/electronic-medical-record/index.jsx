import {createFileRoute} from '@tanstack/react-router'
import ElectronicMedicalRecordPage from "@features/emr/pages/index.jsx";

export const Route = createFileRoute('/_protected/electronic-medical-record/')({
    component: ElectronicMedicalRecordPage,
})
