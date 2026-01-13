// src/routes/_protected/settings/references.jsx
import {createFileRoute} from '@tanstack/react-router';
import {requirePermission} from '@/middleware/permissionMiddleware';
import {PERMISSIONS} from '@/constants/permissions';
import ReferencesPage from "@/pages/settings/references/index.jsx";

export const Route = createFileRoute('/_protected/settings/references/')({
    component: ReferencesPage,
});