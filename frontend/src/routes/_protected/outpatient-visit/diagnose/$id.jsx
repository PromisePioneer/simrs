import {createFileRoute} from '@tanstack/react-router'
import DiagnoseForm from "@/pages/outpatient-visit/diagnose/form.jsx";

export const Route = createFileRoute(
    '/_protected/outpatient-visit/diagnose/$id',
)({
    component: DiagnoseForm,
})
