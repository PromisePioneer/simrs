import {createFileRoute} from '@tanstack/react-router'
import ElectronicMedicalRecordPage from "@/pages/emr/index.jsx";

export const Route = createFileRoute('/_protected/electronic-medical-record/')({
    component: ElectronicMedicalRecordPage,
})
