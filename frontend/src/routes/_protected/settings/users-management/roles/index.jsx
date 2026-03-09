import {createFileRoute} from '@tanstack/react-router'
import RolePage from "@/pages/settings/users-management/roles/index.jsx";

export const Route = createFileRoute(
    '/_protected/settings/users-management/roles/',
)({
    component: RolePage,
})
