import {createFileRoute} from '@tanstack/react-router'
import RolePage from "@features/users-management/pages/roles/index.jsx";

export const Route = createFileRoute(
    '/_protected/settings/users-management/roles/',
)({
    component: RolePage,
})
