import {createFileRoute} from '@tanstack/react-router'
import InpatientPage from "@features/inpatient/pages/index.jsx";

export const Route = createFileRoute('/_protected/inpatient/')({
    component: InpatientPage,
})
