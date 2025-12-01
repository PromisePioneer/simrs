import {createFileRoute} from '@tanstack/react-router';
import RoleManagement from '@/pages/Master/Role/role-management.jsx';

export const Route = createFileRoute('/_protected/master/role')({
    component: RoleManagement,
});