import {createFileRoute} from '@tanstack/react-router'
import OutpatientPage from "@features/outpatient/pages/index.jsx";

export const Route = createFileRoute('/_protected/outpatient/visit/')({
    component: OutpatientPage,
})
