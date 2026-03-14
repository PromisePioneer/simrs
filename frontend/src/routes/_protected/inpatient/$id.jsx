import {createFileRoute} from '@tanstack/react-router'
import InpatientDetailPage from "@/pages/inpatient/detail/index.jsx";

export const Route = createFileRoute('/_protected/inpatient/$id')({
    component: InpatientDetailPage,
})