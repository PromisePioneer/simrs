import {createFileRoute} from '@tanstack/react-router';
import ReferencesPage from "@features/settings/pages/references/index.jsx";
import {z} from "zod";


const referencesSearchSchema = z.object({
    tab: z.enum(['degrees', 'payment-methods', 'registration-institutions', 'poli', 'departments', 'room-types', 'diseases']).optional().default('degrees')
})

export const Route = createFileRoute('/_protected/settings/references/')({
    validateSearch: referencesSearchSchema,
    component: ReferencesPage,
});