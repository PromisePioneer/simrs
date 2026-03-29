import {createFileRoute} from '@tanstack/react-router'
import UserDetail from "@features/users-management/pages/users/detail.jsx";

export const Route = createFileRoute(
    '/_protected/settings/users-management/users/$id/detail',
)({
    component: UserDetail,
})
