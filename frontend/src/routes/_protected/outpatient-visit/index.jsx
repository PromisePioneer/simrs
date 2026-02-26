import {createFileRoute} from '@tanstack/react-router'
import OutpatientPage from "@/pages/outpatient/index.jsx";

export const Route = createFileRoute('/_protected/outpatient-visit/')({
    component: OutpatientPage,
})
