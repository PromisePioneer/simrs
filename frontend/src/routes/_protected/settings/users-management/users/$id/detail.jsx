import {createFileRoute} from '@tanstack/react-router'
import UserDetail from "@/pages/settings/users-management/users/detail.jsx";

export const Route = createFileRoute(
    '/_protected/settings/users-management/users/$id/detail',
)({
    component: UserDetail,
})
