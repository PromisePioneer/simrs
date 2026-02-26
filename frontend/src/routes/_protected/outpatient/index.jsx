import {createFileRoute} from '@tanstack/react-router'
import OutpatientPage from "@/pages/outpatient/index.jsx";
import {z} from "zod";


const outpatientSearchSchema = z.object({
    tab: z.enum(['outpatient-visit', 'prescription-dispensing']).optional().default('outpatient-visit')
})

export const Route = createFileRoute('/_protected/outpatient/')({
    validateSearch: outpatientSearchSchema,
    component: OutpatientPage,
})
