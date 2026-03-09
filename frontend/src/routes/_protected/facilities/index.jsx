import {createFileRoute} from '@tanstack/react-router'
import ProfilePage from "@/pages/facilities/index.jsx";
import {z} from "zod";
import FacilityPage from "@/pages/facilities/index.jsx";


const searchSchema = z.object({
    tab: z.enum(['inpatient']).optional().default('building')
})


export const Route = createFileRoute('/_protected/facilities/')({
    component: FacilityPage,
});