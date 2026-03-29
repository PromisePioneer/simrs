import {createFileRoute} from '@tanstack/react-router'
import DiagnoseForm from "@features/outpatient/pages/visit/diagnose/form.jsx";

export const Route = createFileRoute(
    '/_protected/outpatient/diagnose/$id',
)({
    component: DiagnoseForm,
})
