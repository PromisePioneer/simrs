import {createFileRoute} from '@tanstack/react-router'
import ProfilePage from "@features/facilities/pages/index.jsx";
import {z} from "zod";
import FacilityPage from "@features/facilities/pages/index.jsx";


const searchSchema = z.object({
    tab: z.enum(['inpatient']).optional().default('building')
})


export const Route = createFileRoute('/_protected/facilities/')({
    component: FacilityPage,
});