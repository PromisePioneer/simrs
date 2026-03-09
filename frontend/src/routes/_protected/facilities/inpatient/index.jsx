import {createFileRoute} from '@tanstack/react-router';
import {z} from "zod";
import InpatientFacilityPage from "@/pages/facilities/inpatient/index.jsx";


const searchSchema = z.object({
    tab: z.enum(['buildings', 'wards']).optional().default('buildings')
})

export const Route = createFileRoute('/_protected/facilities/inpatient/')({
    validateSearch: searchSchema,
    component: InpatientFacilityPage,
})
