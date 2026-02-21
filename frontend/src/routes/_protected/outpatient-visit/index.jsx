import {createFileRoute} from '@tanstack/react-router'
import OutpatientPage from "@/pages/outpatient-visit/index.jsx";

export const Route = createFileRoute('/_protected/outpatient-visit/')({
    component: OutpatientPage,
})
