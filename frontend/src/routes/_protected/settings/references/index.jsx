// src/routes/_protected/settings/references.jsx
import {createFileRoute} from '@tanstack/react-router';
import {requirePermission} from '@/middleware/permissionMiddleware';
import {PERMISSIONS} from '@/constants/permissions';
import ReferencesPage from "@/pages/settings/references/index.jsx";
import {z} from "zod";


const referencesSearchSchema = z.object({
    tab: z.enum(['degrees', 'cashier-methods', 'registration-institutions', 'poli']).optional().default('medicine-management')
})

export const Route = createFileRoute('/_protected/settings/references/')({
    validate: referencesSearchSchema,
    component: ReferencesPage,
});