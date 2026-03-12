import {createFileRoute} from '@tanstack/react-router'
import InpatientPage from "@/pages/inpatient/index.jsx";

export const Route = createFileRoute('/_protected/inpatient/')({
    component: InpatientPage,
})
