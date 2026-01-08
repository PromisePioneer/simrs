import {createFileRoute} from '@tanstack/react-router'
import UserPage from "@/pages/settings/users-management/users/index.jsx";

export const Route = createFileRoute(
    '/_protected/settings/users-management/users/',
)({
    component: UserPage,
})
