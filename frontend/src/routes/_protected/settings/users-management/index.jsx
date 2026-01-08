import {createFileRoute} from '@tanstack/react-router'
import UsersManagementPage from "@/pages/settings/users-management/index.jsx";

export const Route = createFileRoute('/_protected/settings/users-management/')({
    component: UsersManagementPage,
})
